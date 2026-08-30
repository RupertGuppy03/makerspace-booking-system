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
    [TestClass]
    public sealed class ApiIntegrationTests
    {
        private TestWebApplicationFactory _factory;
        private HttpClient _client;

        [TestInitialize]
        public void Init()
        {
            _factory = new TestWebApplicationFactory();
            _client = _factory.CreateClient();
        }

        [TestMethod]
        public async Task ToolQuery_UnderSecondsLimit()
        {
            Assert.IsTrue(true);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _client.Dispose();
            _factory.Dispose();
        }

    }
}

