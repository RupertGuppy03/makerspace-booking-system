using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace makerspace_booking_system.Server.Models
{
    [Table("Tools")]
    public class ToolSupa : BaseModel
    {
        [PrimaryKey("id")]
        public int Id { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt{ get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("is_taken_out")]
        public bool IsTakenOut { get; set; }

        [Column("maintenance_period")]
        public int MaintenancePeriod { get; set; }

        [Column("last_maintained")]
        public DateOnly LastMaintained { get; set; }

        [Column("daily_rate")]
        public decimal DailyRate { get; set; }
    }
}
