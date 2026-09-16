using System.Globalization;
using makerspace_booking_system.Server.Models;

namespace makerspace_booking_system.Server.Services
{
    // does the calcualtions to turn database rowns into actual numbers on the dashboard for the management page
    public static class DashboardMetricsBuilder
    {
        public static DashboardMetrics Build(
            List<Reservation> reservations,
            List<Tool> tools,
            List<DamageIncident> incidents,
            DateTime now)
        {
            var months = BuildMonthsList(now);
            var windowStart = months[0];
            var windowEnd = months[^1].AddMonths(1);

            // only booking in the last 12 months filter
            var inWindow = reservations
            .Where(r => r.StartDay >= windowStart && r.StartDay < windowEnd)
            .ToList();

            return new DashboardMetrics(
                  BuildRevenueMetrics(inWindow, months),
                  BuildUserMetrics(inWindow, months, now),
                  BuildToolMetrics(inWindow, tools, incidents, windowStart, windowEnd)
              );
        
        }


        // --- shared helpers -------------------------------------------------

        // The first day of each of the last 12 months, oldest first.
        private static List<DateTime> BuildMonthsList(DateTime now)
        {
            var firstOfThisMonth = new DateTime(
                now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var months = new List<DateTime>();
            for (var i = 11; i >= 0; i--)
            {
                months.Add(firstOfThisMonth.AddMonths(-i));
            }
            return months;
        }

        // The X axis label on every chart, e.g. "Sep 25".
        private static string Label(DateTime monthStart)
        {
            return monthStart.ToString("MMM yy", CultureInfo.InvariantCulture);
        }

        // Was this booking made in this particular month?
        private static bool IsInMonth(Reservation reservation, DateTime month)
        {
            return reservation.StartDay.Year == month.Year
                && reservation.StartDay.Month == month.Month;
        }

        // A percentage rounded to one decimal place. Returns 0 rather than
        // dividing by zero, because a NaN reaching Recharts blanks the chart.
        private static double Percent(int part, int whole)
        {
            if (whole == 0) return 0;
            return Math.Round(part * 100.0 / whole, 1);
        }

        // --- revenue tab ----------------------------------------------------

        private static RevenueMetrics BuildRevenueMetrics(
            List<Reservation> reservations, List<DateTime> months)
        {
            // A cancelled booking never took any money.
            var charged = reservations
                .Where(r => r.Status != "cancelled")
                .ToList();

            var monthly = new List<MonthlyRevenue>();
            foreach (var month in months)
            {
                var total = charged
                    .Where(r => IsInMonth(r, month))
                    .Sum(r => r.AmountCharged);

                monthly.Add(new MonthlyRevenue(Label(month), total));
            }

            return new RevenueMetrics(charged.Sum(r => r.AmountCharged), monthly);
        }

        // --- user tab -------------------------------------------------------

        private static UserMetrics BuildUserMetrics(
            List<Reservation> reservations, List<DateTime> months, DateTime now)
        {
            var onTimeTrend = new List<MonthlyRate>();
            var overdueTrend = new List<MonthlyDuration>();
            var cancellationTrend = new List<MonthlyRate>();
            var noShowTrend = new List<MonthlyRate>();

            // Same four sums as below, but one month's bookings at a time.
            foreach (var month in months)
            {
                var forMonth = reservations.Where(r => IsInMonth(r, month)).ToList();
                var label = Label(month);

                onTimeTrend.Add(new MonthlyRate(label, OnTimeRate(forMonth)));
                overdueTrend.Add(new MonthlyDuration(label, AverageOverdueDays(forMonth)));
                cancellationTrend.Add(new MonthlyRate(label, CancellationRate(forMonth)));
                noShowTrend.Add(new MonthlyRate(label, NoShowRate(forMonth, now)));
            }

            return new UserMetrics(
                OnTimeRate(reservations),
                AverageOverdueDays(reservations),
                CancellationRate(reservations),
                NoShowRate(reservations, now),
                onTimeTrend,
                overdueTrend,
                cancellationTrend,
                noShowTrend);
        }

        // Of the bookings that came back, how many were on time?
        // Bookings still out are ignored - they aren't late until they're late.
        private static double OnTimeRate(List<Reservation> reservations)
        {
            var returned = reservations.Where(r => r.ReturnedAt != null).ToList();
            var onTime = returned.Count(r => r.ReturnedAt <= r.EndDay);

            return Percent(onTime, returned.Count);
        }

        // Average days late, counting only bookings that were actually late,
        // so on-time returns don't drag the average toward zero.
        private static double AverageOverdueDays(List<Reservation> reservations)
        {
            var late = reservations
                .Where(r => r.ReturnedAt != null && r.ReturnedAt > r.EndDay)
                .ToList();

            if (late.Count == 0) return 0;

            var average = late.Average(r => (r.ReturnedAt!.Value - r.EndDay).TotalDays);
            return Math.Round(average, 1);
        }

        private static double CancellationRate(List<Reservation> reservations)
        {
            var cancelled = reservations.Count(r => r.Status == "cancelled");
            return Percent(cancelled, reservations.Count);
        }

        // Never collected, never cancelled, and the due date has already passed.
        private static double NoShowRate(List<Reservation> reservations, DateTime now)
        {
            var noShows = reservations.Count(r =>
                r.CollectedAt == null
                && r.Status != "cancelled"
                && r.EndDay < now);

            return Percent(noShows, reservations.Count);
        }

        // --- tool tab -------------------------------------------------------

        private static ToolMetrics BuildToolMetrics(
            List<Reservation> reservations,
            List<Tool> tools,
            List<DamageIncident> incidents,
            DateTime windowStart,
            DateTime windowEnd)
        {
            var utilisation = new List<ToolUtilisation>();
            var damage = new List<ToolDamage>();
            var demand = new List<ToolDemand>();

            var daysInWindow = (windowEnd - windowStart).TotalDays;

            foreach (var tool in tools)
            {
                var forTool = reservations.Where(r => r.ToolId == tool.Id).ToList();

                // How many days this tool was actually booked out.
                var bookedDays = forTool
                    .Where(r => r.Status != "cancelled")
                    .Sum(r => OverlapDays(r.StartDay, r.EndDay, windowStart, windowEnd));

                utilisation.Add(new ToolUtilisation(
                    tool.Id,
                    tool.Name,
                    Math.Round(bookedDays * 100.0 / daysInWindow, 1)));

                var incidentCount = incidents.Count(i =>
                    i.ToolId == tool.Id
                    && i.CreatedAt != null
                    && i.CreatedAt >= windowStart
                    && i.CreatedAt < windowEnd);

                damage.Add(new ToolDamage(tool.Id, tool.Name, incidentCount));

                // Cancellations still count here - someone wanted the tool.
                demand.Add(new ToolDemand(tool.Id, tool.Name, forTool.Count));
            }

            // Biggest bar first, so the charts read top to bottom.
            return new ToolMetrics(
                utilisation.OrderByDescending(t => t.UtilisationRate).ToList(),
                damage.OrderByDescending(t => t.DamageCount).ToList(),
                demand.OrderByDescending(t => t.RequestCount).ToList());
        }

        // How many days of one booking fall inside the reporting window.
        private static double OverlapDays(
            DateTime start, DateTime end, DateTime windowStart, DateTime windowEnd)
        {
            var from = start > windowStart ? start : windowStart;
            var to = end < windowEnd ? end : windowEnd;

            var days = (to - from).TotalDays;
            return days > 0 ? days : 0;
        }

    }
}