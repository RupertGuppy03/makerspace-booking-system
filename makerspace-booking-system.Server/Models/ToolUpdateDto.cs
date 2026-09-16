/*
 * This is for the Updating Tool details (name, date, maintenance, cost)
 * 
 */

namespace makerspace_booking_system.Server.Models {
    /*
     * All fields are nullable so only the ones the Admin 
     * wants to update will be sent in the request body
     */
    public class ToolUpdateDto {
        public string? Name { get; set; }
        public bool? IsTakenOut { get; set; }
        public int? MaintenancePeriod { get; set; }
        public DateTime? LastMaintained { get; set; }
        public decimal? DailyRate { get; set; }
    }
}