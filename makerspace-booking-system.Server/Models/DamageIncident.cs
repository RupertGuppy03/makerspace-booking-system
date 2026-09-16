using System.ComponentModel.DataAnnotations.Schema;

namespace makerspace_booking_system.Server.Models
{
    public class DamageIncident
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt{ get; set; }

        [Column("tool_id")]
        public int ToolId { get; set; }
        // Nullable: damage found during maintenance has no booking to blame.
        [Column("reservation_id")]
        public int? ReservationId { get; set; }

        [Column("severity")]
        public string Severity { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("repair_cost")]
        public decimal RepairCost { get; set; }

        // Nullable: null means the incident is still unresolved.
        [Column("resolved_at")]
        public DateTime? ResolvedAt { get; set; }
    }
}