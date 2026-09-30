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
            var createdReservation = await _dbContext.Reservations.FirstOrDefaultAsync(r => r.ToolId == testTool.Id && r.StartDay == startDay); 
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
            var newReservation = await _dbContext.Reservations.FirstOrDefaultAsync(r => r.ToolId == testTool.Id && r.StartDay == existingEndDay.AddDays(startDayOffset) && r.EndDay == existingEndDay.AddDays(endDayOffset));

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

        //This test has no correlated test case
        /*
        [TestMethod]
        public async Task CreateReservation_EndDateBeforeStart_FailsWithMessage()
        {
            //Arrange - Get the test tool from Init()
            var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");

            Reservation reservation = new()
            {
                StartDay = new DateTime(2027, 5, 12),
                EndDay = new DateTime(2027, 5, 10),  // EndDay before StartDay
                AmountCharged = testTool.DailyRate * 2,
                Status = "Booked",
                ToolId = testTool.Id,
                UserId = Guid.Parse(TestAccountId)
            };


            //Act - Do POST request with test data
            var res = await _client.PostAsJsonAsync("/api/reservation", reservation);
            var json = await res.Content.ReadAsStringAsync();
            var jsonNode = JsonNode.Parse(json);
            var detail = jsonNode?["detail"]?.GetValue<string>();


            //Assert - Check response failure and message
            Assert.IsFalse(res.IsSuccessStatusCode, $"Response did not fail: {json}");
            Assert.Contains("before the start", detail, "error message does not indicate the end date was set before the start date.");
        }
        */

        //This test has no correlated test case
        /*
        [TestMethod]
        public async Task CreateReservation_IsInPast_FailsWithMessage()
        {
            //Arrange - Get the test tool from Init()
            var testTool = await _dbContext.Tools.FirstAsync(t => t.Name == "test_tool_1");

            Reservation reservation = new()
            {
                StartDay = new DateTime(2025, 5, 5),  // Past date
                EndDay = new DateTime(2025, 5, 8),
                AmountCharged = testTool.DailyRate * 3,
                Status = "Booked",
                ToolId = testTool.Id,
                UserId = Guid.Parse(TestAccountId)
            };

            //Act - Do POST request with test data
            var res = await _client.PostAsJsonAsync("/api/reservation", reservation);
            var json = await res.Content.ReadAsStringAsync();
            var jsonNode = JsonNode.Parse(json);
            var detail = jsonNode?["detail"]?.GetValue<string>();


            //Assert - Check response failure and message
            Assert.IsFalse(res.IsSuccessStatusCode, $"Response did not fail: {json}");
            Assert.Contains("the past", detail, "error message does not indicate reservation was made in the past.");
        }
        */

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
        public async Task DoNothing()
        {
            var n = 2;
            Assert.AreEqual(2, n);
        }

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
        //Only use for reading the database, not making changes
        private async Task<T> WithNewDbContextAsync<T>(Func<SupabaseDbContext, Task<T>> action)
        {
            using var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<SupabaseDbContext>();
            return await action(dbContext);
        }


    }
}

