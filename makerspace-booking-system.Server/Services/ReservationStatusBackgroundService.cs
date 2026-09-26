using makerspace_booking_system.Server.Models;
using Microsoft.EntityFrameworkCore;


namespace makerspace_booking_system.Server.Services
{
    public class ReservationStatusBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ReservationStatusBackgroundService> _logger;
        private readonly TimeSpan _updateInterval = TimeSpan.FromMinutes(30); // Run every 30 minutes and once on startup

        public ReservationStatusBackgroundService(IServiceProvider serviceProvider, ILogger<ReservationStatusBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("ReservationStatusBackgroundService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    //Create scope for the reservation status service to do its work in
                    using var scope = _serviceProvider.CreateScope();
                    var statusService = scope.ServiceProvider.GetRequiredService<IReservationStatusService>();

                    //Call function
                    await statusService.UpdateExpiredReservationsAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error in ReservationStatusBackgroundService: {ex.Message}");
                }

                //
                await Task.Delay(_updateInterval, stoppingToken);
            }

            _logger.LogInformation("ReservationStatusBackgroundService stopped.");
        }
    }
}
