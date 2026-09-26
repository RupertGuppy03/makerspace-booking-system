using makerspace_booking_system.Server.Models;
using Microsoft.EntityFrameworkCore;


namespace makerspace_booking_system.Server.Services
{
    public interface IReservationStatusService
    {
        Task UpdateExpiredReservationsAsync();
    }

    public class ReservationStatusService : IReservationStatusService
    {
        private readonly ILogger<ReservationStatusService> _logger;
        private readonly SupabaseDbContext _context;

        public ReservationStatusService(ILogger<ReservationStatusService> logger, SupabaseDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task UpdateExpiredReservationsAsync()
        {
            try
            {
                //Gets the current date (exludes the time component so < operations can compare days accurately)
                var today = DateTime.UtcNow.Date;


                //get all reservations with a status that might need updating and the endDay is in the past
                var expiredReservations = await _context.Reservations
                    .Where(r => (r.Status == "booked" || r.Status == "ready" || r.Status == "collected"))
                    .ToListAsync();

                if (expiredReservations.Count == 0)
                {
                    _logger.LogInformation("No expired reservations found.");
                    return;
                }

                // Update status from booked to ready, ready to no_show, or collected to overdue
                foreach (var reservation in expiredReservations)
                {
                    if (reservation.StartDay <= today && reservation.Status == "booked")
                    {
                        reservation.Status = "ready";
                        _logger.LogInformation($"Updated reservation {reservation.Id} to no_show");
                        continue;
                    }

                    if (reservation.EndDay < today)
                    {
                        if (reservation.Status == "ready" || reservation.Status == "booked") //This should never be "booked" here, but is added just in case
                        {
                            reservation.Status = "no_show";
                            _logger.LogInformation($"Updated reservation {reservation.Id} to no_show");
                            continue;
                        }
                        if (reservation.Status == "collected")
                        {
                            reservation.Status = "overdue";
                            _logger.LogInformation($"Updated reservation {reservation.Id} to overdue");
                            continue;
                        }
                    }

                }

                //save changes
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating expired reservations: {ex.Message}");
            }
        }
    }
}
