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

        [Column("equipment_id")]
        public int EquipmentId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }
    }
}
