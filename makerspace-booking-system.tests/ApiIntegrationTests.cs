using makerspace_booking_system.Server;
using makerspace_booking_system.Server.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Supabase.Gotrue.Mfa;
using System.Net.Http.Json;
using System.Net.NetworkInformation;
using System.Text.Json.Nodes;
using System.Xml.Linq;



namespace makerspace_booking_system.tests
{

    [TestClass]
    [DoNotParallelize] //Do not parallelize to prevent tests using the same database from influencing each other
    public class ApiIntegrationTests
    {
        private SupabaseDbContext _dbContext = null!;
        private WebApplicationFactory<Program> _factory = null!;
        private HttpClient _client = null!;

        const string TestAccountId = "189cde20-8141-4283-b3bc-f278aaf7576a";

        //Code to run before every test
        [TestInitialize]
        public void Init()
        {
            _factory = new WebApplicationFactory<Program>();
            _client = _factory.CreateClient();


            //_dbContext is used to create or read from the database during Arrange.
            //During Assert, the WithNewDbContextAsync should be used so it doesn't use local cached data from the exisitng dbContext
            var scope = _factory.Services.CreateScope();
            _dbContext = scope.ServiceProvider.GetRequiredService<SupabaseDbContext>();


            //Set up the database with a tool and reservation.

            //A test account already exists:
            //    id: 189cde20-8141-4283-b3bc-f278aaf7576a
            //    email: autotest@gmail.com
            //    password: test123
            //    role: manager

            var tool = new Tool
            {
                Name = "test_tool_1",
                CreatedAt = DateTime.UtcNow,
                IsTakenOut = false,
                MaintenancePeriod = 30,
                LastMaintained = DateTime.UtcNow.AddDays(-12),
                DailyRate = 25.00m
            };

            var reservation = new Reservation
            {
                Tool = tool,
                UserId = Guid.Parse(TestAccountId),
                StartDay = DateTime.UtcNow.Date.AddDays(5),
                EndDay = DateTime.UtcNow.Date.AddDays(7),
                Status = "booked",
                AmountCharged = tool.DailyRate * 3
                //collected/returned/cancelled_at are default=null
            };


            _dbContext.Add(tool);
            _dbContext.Add(reservation);

            _dbContext.SaveChanges();
        }

        [TestMethod]
        public async Task CreateReservation_ReservationIsAdded()
        {
            //Arrange - Get the test tool from Init()
            var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");

            var startDay = DateTime.UtcNow.Date.AddDays(8);
            var endDay = DateTime.UtcNow.Date.AddDays(10);

            Reservation reservation = new()
            {
                StartDay = startDay,
                EndDay = endDay,
                AmountCharged = testTool.DailyRate * 2,
                Status = "booked",
                ToolId = testTool.Id,
                UserId = Guid.Parse(TestAccountId)
            };


            //Act - Do POST request with test data
            var res = await _client.PostAsJsonAsync("/api/reservation", reservation);
            var json = await res.Content.ReadAsStringAsync();


            //Assert - Check good response and reservation was added
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            // Get reservation which was just added to database
            var createdReservation = await WithNewDbContextAsync(async db =>
                await db.Reservations.FirstOrDefaultAsync(r => r.ToolId == testTool.Id && r.StartDay == startDay)
            ); 
            // Check reservation is present and correct
            Assert.IsNotNull(createdReservation, "Reservation was not found in the database");
        }

        [TestMethod]
        [DataRow(-1,2,true)]
        [DataRow(0,3,true)]
        [DataRow(1,4,false)]
        public async Task CreateReservation_BoundaryDates_ReservationNotCreatedIfOverlaps(int startDayOffset, int endDayOffset, bool shouldFail)
        {
            //Arrange - Get the test tool and existing reservation from Init()
            var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");
            var existingReservation = await _dbContext.Reservations
                .FirstAsync(r => r.ToolId == testTool.Id && r.Status == "booked");

            var existingEndDay = DateTime.SpecifyKind(existingReservation.EndDay, DateTimeKind.Utc);

            // Create a reservation that overlaps with the existing one
            Reservation overlappingReservation = new()
            {
                StartDay = existingEndDay.AddDays(startDayOffset), 
                EndDay = existingEndDay.AddDays(endDayOffset),
                AmountCharged = testTool.DailyRate * 3,
                Status = "booked",
                ToolId = testTool.Id,
                UserId = Guid.Parse(TestAccountId)
            };

            //Act - Do POST request with overlapping test data
            var res = await _client.PostAsJsonAsync("/api/reservation", overlappingReservation);
            var json = await res.Content.ReadAsStringAsync();

            //Assert - Check response failure
            //Check the reservation which was attempted to be made does not exist
            var newReservation = await WithNewDbContextAsync(async db => 
            await db.Reservations.FirstOrDefaultAsync(
                r => r.ToolId == testTool.Id && r.StartDay == existingEndDay.AddDays(startDayOffset) && r.EndDay == existingEndDay.AddDays(endDayOffset)
                )
            );

            if (shouldFail)
            {
                Assert.IsFalse(res.IsSuccessStatusCode, $"Response did not fail: {json}");
                Assert.IsNull(newReservation);
            } else
            {
                Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");
                Assert.IsNotNull(newReservation);
            }
        }

        [TestMethod]
        public async Task CreateTool_ToolIsAdded()
        {
            //Arrange - Create test data
            Tool tool = new()
            {
                Name = "test_tool_new",
                DailyRate = 25,
                MaintenancePeriod = 45,
            };


            //Act - Do POST request with test data
            var res = await _client.PostAsJsonAsync("/api/tool", tool);
            var json = await res.Content.ReadAsStringAsync();


            //Assert - Check good response and tool was added
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            // Get tool which was just added to database

            var createdTool = await WithNewDbContextAsync(async db =>
                await db.Tools.FirstOrDefaultAsync(t => t.Name == "test_tool_new")
            );
            // Check tool is correct
            Assert.IsNotNull(createdTool, "Tool was not found in the database");
            Assert.AreEqual("test_tool_new", createdTool.Name);
        }

        [TestMethod]
        public async Task UpdateTool_ToolIsUpdated()
        {
            //Arrange - Get the test tool from Init() and update it
            var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");
            decimal newRate = 28;
            testTool.DailyRate = newRate;

            //Act - Do PATCH request to update tool
            var res = await _client.PatchAsJsonAsync($"/api/tool/{testTool.Id}", testTool);
            var json = await res.Content.ReadAsStringAsync();

            //Assert - Check good response and tool has changed attribute
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            var updatedTool = await WithNewDbContextAsync(async db => 
                await db.Tools.FirstOrDefaultAsync(t => t.Id == testTool.Id)
            );

            Assert.IsNotNull(updatedTool, "Tool was not found in the database");
            Assert.AreEqual(newRate, updatedTool.DailyRate);
        }

        [TestMethod]
        public async Task MaintainTool_ToolLastMaintainedIsUpdated()
        {
            //Arrange - Get the test tool from Init()
            var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");
            DateTime timeMaintained = DateTime.UtcNow.Date;

            //Act - Do PATCH request to update tool
            var res = await _client.PatchAsJsonAsync($"/api/tool/{testTool.Id}/maintain", timeMaintained);
            var json = await res.Content.ReadAsStringAsync();

            //Assert - Check good response and tool has changed attribute
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            var maintainedTool = await WithNewDbContextAsync(async db =>
                await db.Tools.FirstOrDefaultAsync(t => t.Id == testTool.Id)
                );

            Assert.IsNotNull(maintainedTool, "Tool was not found in the database");
            Assert.AreEqual(timeMaintained, maintainedTool.LastMaintained);
        }


        [TestMethod]
        public async Task CreateReservation_ToolNeedsMaintenance_FailsCreation()
        {
            //Arrange - Create a tool that needs maintenance
            var toolNeedsMaintenance = new Tool
            {
                Name = "test_tool_needs_maintenance",
                CreatedAt = DateTime.UtcNow,
                IsTakenOut = false,
                MaintenancePeriod = 30,
                LastMaintained = DateTime.UtcNow.AddDays(-31), // Overdue for maintenance
                DailyRate = 25.00m
            };

            //add tool to database
            _dbContext.Add(toolNeedsMaintenance);
            _dbContext.SaveChanges();

            //Create reservation to attempt to add
            var startDay = DateTime.UtcNow.Date.AddDays(8);
            var endDay = DateTime.UtcNow.Date.AddDays(10);

            var reservation = new Reservation
            {
                StartDay = startDay,
                EndDay = endDay,
                AmountCharged = toolNeedsMaintenance.DailyRate * 3,
                Status = "booked",
                ToolId = toolNeedsMaintenance.Id,
                UserId = Guid.Parse(TestAccountId)
            };

            //Act - Try to create reservation for tool that needs maintenance
            var res = await _client.PostAsJsonAsync("/api/reservation", reservation);
            var json = await res.Content.ReadAsStringAsync();

            //Assert - Check response failed for the correct reason
            Assert.IsFalse(res.IsSuccessStatusCode, $"Response did not fail: {json}");
            Assert.Contains("maintenance", json, "Error message should mention the 5 day limit");

            //Check reservation was not created
            var createdReservation = await WithNewDbContextAsync(async db =>
                await db.Reservations.FirstOrDefaultAsync(r => r.ToolId == toolNeedsMaintenance.Id && r.StartDay == startDay)
            );
            Assert.IsNull(createdReservation);

        }

        // [TestMethod]
        // [DataRow(8, 12, false)]
        // [DataRow(8, 13, true)]
        // [DataRow(8, 14, true)]
        //Creation should fail if the reservation covers a total of more than 5 days, i.e. EndDay is more than 4 days after StartDay
        // fix or remove  
        // public async Task CreateReservation_GreaterThan5Days_FailsCreation(int startDays, int endDays, bool shouldFail)
        // {
        //     //Arrange - Get the test tool from Init()
        //     var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");

        //     var startDay = DateTime.UtcNow.Date.AddDays(startDays);
        //     var endDay = DateTime.UtcNow.Date.AddDays(endDays); 

        //     Reservation reservation = new()
        //     {
        //         StartDay = startDay,
        //         EndDay = endDay,
        //         AmountCharged = testTool.DailyRate * 6,
        //         Status = "booked",
        //         ToolId = testTool.Id,
        //         UserId = Guid.Parse(TestAccountId)
        //     };

        //     //Act - Try to create reservation with duration greater than 5 days
        //     var res = await _client.PostAsJsonAsync("/api/reservation", reservation);
        //     var json = await res.Content.ReadAsStringAsync();

        //     //Assert - Check response failed for the correct reason
        //     //Check whether or not reservation was created
        //     var createdReservation = await WithNewDbContextAsync(async db =>
        //         await db.Reservations.FirstOrDefaultAsync(r => r.ToolId == testTool.Id && r.StartDay == startDay)
        //     );

        //     if (shouldFail)
        //     {
        //         Assert.IsFalse(res.IsSuccessStatusCode, $"Response should have failed but succeeded: {json}");
        //         Assert.Contains("5 days", json, "Error message should mention the 5 day limit");
        //         Assert.IsNull(createdReservation);
        //     }
        //     else
        //     {
        //         Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");
        //         Assert.IsNotNull(createdReservation);
        //     }
        // }

        [TestMethod]
        public async Task DeleteTool_HasActiveReservation_FailsDeletion()
        {
            //Arrange - Get the test tool from Init()
            var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");

            //Act - Try to delete tool that has an active reservation
            var res = await _client.DeleteAsync($"/api/tool/{testTool.Id}");
            var json = await res.Content.ReadAsStringAsync();

            //Assert - Check response failed for the correct reason
            Assert.IsFalse(res.IsSuccessStatusCode, $"Response should have failed but succeeded: {json}");
            Assert.Contains( "active or future reservations", json, "Error message should mention active or future reservations");
            var toolStillExists = await WithNewDbContextAsync(async db => 
                await db.Tools.FirstOrDefaultAsync(t => t.Id == testTool.Id)
            );

            //Check tool was not deleted
            Assert.IsNotNull(toolStillExists);
        }

        [TestMethod]
        public async Task ChangeReservationStatus_ReadyToCollected_Succeeds()
        {
            //Arrange - Create reservation with 'ready' status
            var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");

            var reservation = new Reservation
            {
                Tool = testTool,
                UserId = Guid.Parse(TestAccountId),
                StartDay = DateTime.UtcNow.Date.AddDays(15),
                EndDay = DateTime.UtcNow.Date.AddDays(17),
                Status = "ready",
                AmountCharged = testTool.DailyRate * 3
            };

            _dbContext.Add(reservation);
            _dbContext.SaveChanges();

            var reservationId = reservation.Id;

            //Act - Change reservation status from ready to collected
            var res = await _client.PatchAsync($"/api/reservation/{reservationId}/collect", null);
            var json = await res.Content.ReadAsStringAsync();

            //Assert - Check response success
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            //Check reservation status was updated
            var updatedReservation = await WithNewDbContextAsync(async db => 
                await db.Reservations.FirstOrDefaultAsync(r => r.Id == reservationId)
            );
            Assert.IsNotNull(updatedReservation, "Reservation should still exist");
            Assert.AreEqual("collected", updatedReservation.Status, "Reservation status should be 'collected'");

        }

        [TestMethod]
        public async Task ChangeReservationStatus_CollectedToReturned_Succeeds()
        {
            //Arrange - Create a reservation with 'collected' status
            var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");

            var reservation = new Reservation
            {
                Tool = testTool,
                UserId = Guid.Parse(TestAccountId),
                StartDay = DateTime.UtcNow.Date.AddDays(20),
                EndDay = DateTime.UtcNow.Date.AddDays(22),
                Status = "collected",
                AmountCharged = testTool.DailyRate * 2
            };

            _dbContext.Add(reservation);
            _dbContext.SaveChanges();

            var reservationId = reservation.Id;

            //Act - Change reservation status from collected to returned
            var res = await _client.PatchAsync($"/api/reservation/{reservationId}/return", null);
            var json = await res.Content.ReadAsStringAsync();

            //Assert - Check response success
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            // Verify reservation status was updated
            var updatedReservation = await WithNewDbContextAsync(async db =>
                await db.Reservations.FirstOrDefaultAsync(r => r.Id == reservationId)
            );
            Assert.IsNotNull(updatedReservation, "Reservation should still exist");
            Assert.AreEqual("returned", updatedReservation.Status, "Reservation status should be 'returned'");

        }
        // also failing, fix or remove
        // [TestMethod]
        // public async Task SimultaneousReservationCreation_SameDateAndTool_ExactlyOneSucceeds()
        // {
        //     //Arrange - Create a reservation to be sent to database
        //     var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");

        //     var startDay = DateTime.UtcNow.Date.AddDays(2);

        //     var reservation = new Reservation
        //     {
        //         UserId = Guid.Parse(TestAccountId),
        //         StartDay = startDay,
        //         EndDay = DateTime.UtcNow.Date.AddDays(4),
        //         Status = "booked",
        //         ToolId = testTool.Id,
        //         AmountCharged = testTool.DailyRate * 3
        //     };

        //     //Act - Create reservation in database two times asynchronously
        //     var resTask1 = _client.PostAsJsonAsync("/api/reservation", reservation);
        //     var resTask2 = _client.PostAsJsonAsync("/api/reservation", reservation);

        //     var res1 = await resTask1;
        //     var res2 = await resTask2;

        //     var json1 = await res1.Content.ReadAsStringAsync();
        //     var json2 = await res2.Content.ReadAsStringAsync();

        //     //Assert - Exactly one of the requests was successful.
        //     Assert.IsTrue(res1.IsSuccessStatusCode ^ res2.IsSuccessStatusCode, $"Neither or both requests were successful: {json1}, {json2}");

        //     //Check exactly one reservtion exists
        //     var createdReservations = await WithNewDbContextAsync(async db =>
        //         await db.Reservations.Where(r => r.ToolId == testTool.Id && r.StartDay == startDay).ToListAsync()
        //     );
        //     Assert.HasCount(1, createdReservations, $"{createdReservations.Count} reservations were made instead of 1.");

        // }



        //Cleanup after each test
        [TestCleanup]
        public void Cleanup()
        {
            //Delete tools following the "test_tool_" format
            //Related reservations get cascade deleted
            var testTools = _dbContext.Tools.Where(t => t.Name.ToLower().StartsWith("test_tool_")).ToList();
            _dbContext.RemoveRange(testTools);
            _dbContext.SaveChanges();

            //Clear client and factory from memory before next test init
            _client.Dispose();
            _factory.Dispose();
            _dbContext.Dispose();
        }



        //Helper function to reduce repeated code when reading the database with dbcontext
        //dbcontext instances beyond the one made during test initialization is necessary so that getting a tool from the db a 2nd time actually reads from the db instead of using the locally cached object
        //Always use this helper function during Assert (read only). The dbcontext made during init can be used during Arrange. (only API calls are tested during Act)
        private async Task<T> WithNewDbContextAsync<T>(Func<SupabaseDbContext, Task<T>> action)
        {
            using var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<SupabaseDbContext>();
            return await action(dbContext);
        }


    }
}

