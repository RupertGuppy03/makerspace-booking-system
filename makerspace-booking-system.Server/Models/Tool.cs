using System.ComponentModel.DataAnnotations.Schema;

namespace makerspace_booking_system.Server.Models
{
    public class Tool
    {
        // Use [Column("col_name")] to match the column name in supabase
        // Keep the actual attribute name PascalCase

        [Column("id")]
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
        public DateTime LastMaintained { get; set; }

        [Column("daily_rate")]
        public decimal DailyRate { get; set; }
    }
}
