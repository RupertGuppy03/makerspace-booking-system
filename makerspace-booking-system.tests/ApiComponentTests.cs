using makerspace_booking_system.Server;
using makerspace_booking_system.Server.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Supabase.Gotrue.Mfa;
using System.Net.Http.Json;
using System.Text.Json.Nodes;



namespace makerspace_booking_system.tests
{
    //This class tests the api by using an in-memory database, not actually connecting to supabase.

    [TestClass]
    public sealed class ApiComponentTests
    {
        private TestWebApplicationFactory _factory;
        private HttpClient _client;

        [TestInitialize]
        public void Init()
        {
            //Creates a web app factory, including a fresh in-memory database instance
            _factory = new TestWebApplicationFactory();
            //Create the web client
            _client = _factory.CreateClient();
        }

        [TestMethod]
        public async Task CreateReservation_ReservationIsAdded()
        {
            //Arrange - Create test data
            Reservation reservation = new()
            {
                Id = 0,
                StartDay = new DateTime(2027,5,2),
                EndDay = new DateTime(2027,5,4),
                AmountCharged = 32,
                Status = "Booked",
                ToolId = 2,
                UserId = Guid.Parse("43aedb70-19c0-45ec-ae72-2afe16e30de7")
            };


            //Act - Do POST request with test data
            var res = await _client.PostAsJsonAsync("/api/reservation", reservation);
            var json = await res.Content.ReadAsStringAsync();


            //Assert - Check good response and tool was added
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            // Get reservation which was just added to database
            var createdReservation = await WithDbContextAsync(async db =>
                await db.Reservations.FirstOrDefaultAsync(r => r.Id == 1)
            );
            // Check reservation is present and correct
            Assert.IsNotNull(createdReservation, "Resrvation was not found in the database");
            Assert.AreEqual(1, createdReservation.Id);
        }

        [TestMethod]
        public async Task CreateReservation_OverlapsExisting_FailsWithMessage()
        {
            //Arrange - Create test data
            Reservation reservation1 = new()
            {
                Id = 1,
                StartDay = new DateTime(2027, 5, 5),
                EndDay = new DateTime(2027, 5, 8),
                AmountCharged = 32,
                Status = "Booked",
                ToolId = 2,
                UserId = Guid.Parse("43aedb70-19c0-45ec-ae72-2afe16e30de7")
            };

            Reservation reservation2 = new()
            {
                Id = 2,
                StartDay = new DateTime(2027, 5, 7),
                EndDay = new DateTime(2027, 5, 10),
                AmountCharged = 25,
                Status = "Booked",
                ToolId = 2,
                UserId = Guid.Parse("43aedb70-19c0-45ec-ae72-2afe16e30de7")
            };

            using var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<SupabaseDbContext>();
            await dbContext.Reservations.AddAsync(reservation1);
            await dbContext.SaveChangesAsync();


            //Act - Do POST request with test data
            var res = await _client.PostAsJsonAsync("/api/reservation", reservation2);
            var json = await res.Content.ReadAsStringAsync();
            var jsonNode = JsonNode.Parse(json);
            var detail = jsonNode?["detail"]?.GetValue<string>();


            //Assert - Check response failure and message
            Assert.IsFalse(res.IsSuccessStatusCode, $"Response did not fail: {json}");
            Assert.Contains("overlap", detail, "error message does not indicate an overlap.");
        }

        [TestMethod]
        public async Task CreateReservation_EndDateBeforeStart_FailsWithMessage()
        {
            //Arrange - Create test data
            Reservation reservation = new()
            {
                Id = 1,
                StartDay = new DateTime(2027, 5, 12),
                EndDay = new DateTime(2027, 5, 10),
                AmountCharged = 32,
                Status = "Booked",
                ToolId = 2,
                UserId = Guid.Parse("43aedb70-19c0-45ec-ae72-2afe16e30de7")
            };


            //Act - Do POST request with test data
            var res = await _client.PostAsJsonAsync("/api/reservation", reservation);
            var json = await res.Content.ReadAsStringAsync();
            var jsonNode = JsonNode.Parse(json);
            var detail = jsonNode?["detail"]?.GetValue<string>();


            //Assert - Check response failure and message
            Assert.IsFalse(res.IsSuccessStatusCode, $"Response did not fail: {json}");
            Assert.Contains("before the start", detail, "error message does not the end date was set before the start date.");
        }

        [TestMethod]
        public async Task CreateReservation_IsInPast_FailsWithMessage()
        {
            //Arrange - Create test data
            Reservation reservation = new()
            {
                Id = 1,
                StartDay = new DateTime(2025, 5, 5),
                EndDay = new DateTime(2025, 5, 8),
                AmountCharged = 32,
                Status = "Booked",
                ToolId = 2,
                UserId = Guid.Parse("43aedb70-19c0-45ec-ae72-2afe16e30de7")
            };

            //Act - Do POST request with test data
            var res = await _client.PostAsJsonAsync("/api/reservation", reservation);
            var json = await res.Content.ReadAsStringAsync();
            var jsonNode = JsonNode.Parse(json);
            var detail = jsonNode?["detail"]?.GetValue<string>();


            //Assert - Check response failure and message
            Assert.IsFalse(res.IsSuccessStatusCode, $"Response did not fail: {json}");
            Assert.Contains("the past", detail, "error message does not indicate resrvation was made in the past.");
        }

        [TestMethod]
        public async Task CreateTool_ToolIsAdded()
        {
            //Arrange - Create test data
            Tool tool = new()
            {
                Name = "test_tool",
                DailyRate = 25,
                MaintenancePeriod = 45,
            };


            //Act - Do POST request with test data
            var res = await _client.PostAsJsonAsync("/api/tool", tool);
            var json = await res.Content.ReadAsStringAsync();


            //Assert - Check good response and tool was added
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            // Get tool which was just added to database
            var createdTool = await WithDbContextAsync(async db =>
                await db.Tools.FirstOrDefaultAsync(t => t.Name == "test_tool")
            );
            // Check tool is correct
            Assert.IsNotNull(createdTool, "Tool was not found in the database");
            Assert.AreEqual("test_tool", createdTool.Name);
        }

        [TestMethod]
        public async Task UpdateTool_ToolIsUpdated()
        {
            //Arrange - Add tool to database
            Tool tool = new()
            {
                Id = 1,
                Name = "test_tool",
                DailyRate = 25,
                MaintenancePeriod = 45,
            };

            using var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<SupabaseDbContext>();
            await dbContext.Tools.AddAsync(tool);
            await dbContext.SaveChangesAsync();


            tool.DailyRate = 28;

            //Act - Do PATCH request to update tool
            var res = await _client.PatchAsJsonAsync("/api/tool/1", tool);
            var json = await res.Content.ReadAsStringAsync();


            //Assert - Check good response and tool has changed attribute
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            var updatedTool = await WithDbContextAsync(async db =>
                await db.Tools.FirstOrDefaultAsync(t => t.Name == "test_tool")
            );

            Assert.IsNotNull(updatedTool, "Tool was not found in the database");
            Assert.AreEqual(28, updatedTool.DailyRate);
        }


        public async Task MaintainTool_ToolLastMaintainedIsUpdated()
        {
            //Arrange - Add tool to database
            Tool tool = new()
            {
                Id = 4,
                Name = "test_tool",
                DailyRate = 25,
                MaintenancePeriod = 45,
                LastMaintained = new DateTime(2026, 7, 25)
            };

            using var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<SupabaseDbContext>();
            await dbContext.Tools.AddAsync(tool);
            await dbContext.SaveChangesAsync();


            DateTime timeMaintained = DateTime.Now;

            //Act - Do PATCH request to update tool
            var res = await _client.PatchAsJsonAsync("/api/tool/4/maintain", timeMaintained);
            var json = await res.Content.ReadAsStringAsync();


            //Assert - Check good response and tool has changed attribute
            Assert.IsTrue(res.IsSuccessStatusCode, $"Response was not successful: {json}");

            var maintainedTool = await WithDbContextAsync(async db =>
                await db.Tools.FirstOrDefaultAsync(t => t.Id == 4)
            );

            Assert.IsNotNull(maintainedTool, "Tool was not found in the database");
            Assert.AreEqual(timeMaintained, maintainedTool.LastMaintained);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _client.Dispose();
            _factory.Dispose();
        }



        //Helper function to reduce repeated code when reading the database with dbcontext
        private async Task<T> WithDbContextAsync<T>(Func<SupabaseDbContext, Task<T>> action)
        {
            using var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<SupabaseDbContext>();
            return await action(dbContext);
        }
    }
}

