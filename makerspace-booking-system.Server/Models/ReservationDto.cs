namespace makerspace_booking_system.Server.Models
{
    public class ReservationDto
    {
        public DateTime StartDay { get; set; }

        public DateTime EndDay { get; set; }

        public int ToolId { get; set; }

        public required string UserId { get; set; }
    }
}
