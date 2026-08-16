using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace makerspace_booking_system.Server.Models
{
    public class ToolDto : BaseModel
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Name { get; set; }

        public bool IsTakenOut { get; set; }

        public int MaintenancePeriod { get; set; }

        public DateOnly LastMaintained { get; set; }

        public decimal DailyRate { get; set; }
    }
}
