namespace makerspace_booking_system.Server.Models
{
    public class ReservationDto
    {
        public DateTime StartDay { get; set; }

        public DateTime EndDay { get; set; }

        public int ToolId { get; set; }

        public required string UserId { get; set; }

        public string Status { get; set; }

        public DateTime CollectedAt { get; set; }

        public DateTime ReturnedAt { get; set; }

        public DateTime CancelledAt { get; set; }

        public decimal AmountCharged { get; set; }
    }
}
