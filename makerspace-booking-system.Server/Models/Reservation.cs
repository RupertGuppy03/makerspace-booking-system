using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace makerspace_booking_system.Server.Models
{
    [Table("Reservations")]
    public class Reservation : BaseModel
    {
        [PrimaryKey("id")]
        public int Id { get; set; }

        [Column("start_day")]
        public DateTime StartDay{ get; set; }

        [Column("end_day")]
        public DateTime EndDay { get; set; }

        [Column("tool_id")]
        public int ToolId { get; set; }

        [Column("user_id")]
        public string UserId { get; set; }
    }
}
