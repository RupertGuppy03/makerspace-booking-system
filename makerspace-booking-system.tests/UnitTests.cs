using Supabase.Gotrue.Mfa;

using Microsoft.AspNetCore.Mvc.Testing;
using makerspace_booking_system.Server;


namespace makerspace_booking_system.tests
{
    [TestClass]
    public sealed class UnitTests
    {


        [TestMethod]
        [DataRow("2025-5-5", "2025-5-8", "2025-5-9", "2025-5-12", false)] //no overlap
        [DataRow("2025-5-5", "2025-5-8", "2025-5-6", "2025-5-11", true)] //range 1 contains start2
        [DataRow("2025-5-6", "2025-5-11", "2025-5-5", "2025-5-8", true)] //range 2 contains start1 
        [DataRow("2025-5-12", "2025-5-14", "2025-5-11", "2025-5-16", true)] //range 1 fully contains 2
        [DataRow("2025-5-5", "2025-5-8", "2025-5-5", "2025-5-8", true)] //both ranges are the same
        public async Task DateRangesOverlap_DetectsCorrectly(string start1, string end1, string start2, string end2, bool shouldOverlap)
        {
            //Arrange
            DateTime startDate1 = DateTime.Parse(start1);
            DateTime endDate1 = DateTime.Parse(end1);
            DateTime startDate2 = DateTime.Parse(start2);
            DateTime endDate2 = DateTime.Parse(end2);

            //Act
            bool overlaps = Program.DateRangesOverlap(startDate1, endDate1, startDate2, endDate2);

            //Assert
            Assert.AreEqual(overlaps, shouldOverlap);
        }


    }
}
