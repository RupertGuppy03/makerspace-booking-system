using Microsoft.EntityFrameworkCore;
using makerspace_booking_system.Server.Models;

namespace makerspace_booking_system.Server

{
    public class SupabaseDbContext : DbContext
    {
        public SupabaseDbContext(DbContextOptions<SupabaseDbContext> options)
            : base(options) { }

        public DbSet<Tool> Tools => Set<Tool>();
        public DbSet<Reservation> Reservations => Set<Reservation>();

    }
}
