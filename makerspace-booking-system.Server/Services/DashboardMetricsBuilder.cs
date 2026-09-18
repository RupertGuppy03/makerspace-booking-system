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
            var months = MonthBuckets(now);
            var weeks = WeekBuckets(now);

            // The widest span anything on the dashboard reports on: the last 12 months.
            var window = new Bucket("12 months", months[0].Start, months[^1].End);

            // only booking in the last 12 months filter
            var inWindow = reservations
            .Where(r => IsIn(r, window))
            .ToList();

            return new DashboardMetrics(
                BuildRevenueMetrics(inWindow, tools, incidents, weeks, months, window),
                BuildUserMetrics(inWindow, weeks, months, now),
                BuildToolMetrics(inWindow, tools, incidents, weeks, window)
            );
        
        }


        // --- shared helpers -------------------------------------------------

        // One bar or point on a chart: its axis label, and the span of time it covers.
        // End is exclusive, so a booking belongs to it when Start <= StartDay < End.
        private record Bucket(string Label, DateTime Start, DateTime End);

        // Did this booking start inside this bucket?
        private static bool IsIn(Reservation reservation, Bucket bucket)
        {
            return reservation.StartDay >= bucket.Start && reservation.StartDay < bucket.End;
        }

        // The last 12 calendar months, oldest first. The newest is this month.
        private static List<Bucket> MonthBuckets(DateTime now)
        {
            var firstOfThisMonth = new DateTime(
                now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var months = new List<Bucket>();
            for (var i = 11; i >= 0; i--)
            {
                var start = firstOfThisMonth.AddMonths(-i);
                var label = start.ToString("MMM yy", CultureInfo.InvariantCulture);
                months.Add(new Bucket(label, start, start.AddMonths(1)));
            }
            return months;
        }

        // The last 12 Monday-to-Sunday weeks, oldest first. The newest is this week.
        private static List<Bucket> WeekBuckets(DateTime now)
        {
            // DayOfWeek counts Sunday as 0 and Monday as 1, so this works out
            // how many days ago the most recent Monday was (Monday = 0, Sunday = 6).
            var daysSinceMonday = ((int)now.DayOfWeek + 6) % 7;

            var thisMonday = new DateTime(
                now.Year, now.Month, now.Day, 0, 0, 0, DateTimeKind.Utc)
                .AddDays(-daysSinceMonday);

            var weeks = new List<Bucket>();
            for (var i = 11; i >= 0; i--)
            {
                var start = thisMonday.AddDays(-7 * i);
                var label = start.ToString("d MMM", CultureInfo.InvariantCulture);
                weeks.Add(new Bucket(label, start, start.AddDays(7)));
            }
            return weeks;
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
            List<Reservation> reservations,
            List<Tool> tools,
            List<DamageIncident> incidents,
            List<Bucket> weeks,
            List<Bucket> months,
            Bucket window)
        {
            // A cancelled booking never took any money.
            var charged = reservations
                .Where(r => r.Status != "cancelled")
                .ToList();

            return new RevenueMetrics(
                charged.Sum(r => r.AmountCharged),
                new Ranged<RevenuePoint>(
                    RevenueSeries(charged, weeks),
                    RevenueSeries(charged, months)),
                RepairCosts(incidents, tools, window));
        }

        // Money taken in each bucket, one chart point per bucket.
        // Expects cancelled bookings to be filtered out already.
        private static List<RevenuePoint> RevenueSeries(
            List<Reservation> charged, List<Bucket> buckets)
        {
            var points = new List<RevenuePoint>();
            foreach (var bucket in buckets)
            {
                var total = charged
                    .Where(r => IsIn(r, bucket))
                    .Sum(r => r.AmountCharged);

                points.Add(new RevenuePoint(bucket.Label, total));
            }
            return points;
        }

        // Total repair bill per tool over the window, biggest first.
        // Tools with no repair costs are left out, so the chart only lists real costs.
        private static List<ToolRepairCost> RepairCosts(
            List<DamageIncident> incidents, List<Tool> tools, Bucket window)
        {
            var inWindow = incidents
                .Where(i => i.CreatedAt != null
                    && i.CreatedAt >= window.Start
                    && i.CreatedAt < window.End)
                .ToList();

            return tools
                .Select(tool => new ToolRepairCost(
                    tool.Id,
                    tool.Name,
                    inWindow.Where(i => i.ToolId == tool.Id).Sum(i => i.RepairCost)))
                .Where(t => t.RepairCost > 0)
                .OrderByDescending(t => t.RepairCost)
                .ToList();
        }

        // --- user tab -------------------------------------------------------

        private static UserMetrics BuildUserMetrics(
            List<Reservation> reservations,
            List<Bucket> weeks,
            List<Bucket> months,
            DateTime now)
        {
            return new UserMetrics(
                OnTimeRate(reservations),
                AverageOverdueDays(reservations),
                CancellationRate(reservations),
                NoShowRate(reservations, now),
                new Ranged<RatePoint>(
                    OnTimeSeries(reservations, weeks),
                    OnTimeSeries(reservations, months)),
                new Ranged<DurationPoint>(
                    OverdueSeries(reservations, weeks),
                    OverdueSeries(reservations, months)),
                new Ranged<RatePoint>(
                    CancellationSeries(reservations, weeks),
                    CancellationSeries(reservations, months)),
                new Ranged<RatePoint>(
                    NoShowSeries(reservations, weeks, now),
                    NoShowSeries(reservations, months, now))
            );
        }

        // On-time return rate for each bucket, one chart point per bucket.
        private static List<RatePoint> OnTimeSeries(
            List<Reservation> reservations, List<Bucket> buckets)
        {
            var points = new List<RatePoint>();
            foreach (var bucket in buckets)
            {
                var inBucket = reservations.Where(r => IsIn(r, bucket)).ToList();
                points.Add(new RatePoint(bucket.Label, OnTimeRate(inBucket)));
            }
            return points;
        }

        // Average days overdue for each bucket.
        private static List<DurationPoint> OverdueSeries(
            List<Reservation> reservations, List<Bucket> buckets)
        {
            var points = new List<DurationPoint>();
            foreach (var bucket in buckets)
            {
                var inBucket = reservations.Where(r => IsIn(r, bucket)).ToList();
                points.Add(new DurationPoint(bucket.Label, AverageOverdueDays(inBucket)));
            }
            return points;
        }

        // Cancellation rate for each bucket.
        private static List<RatePoint> CancellationSeries(
            List<Reservation> reservations, List<Bucket> buckets)
        {
            var points = new List<RatePoint>();
            foreach (var bucket in buckets)
            {
                var inBucket = reservations.Where(r => IsIn(r, bucket)).ToList();
                points.Add(new RatePoint(bucket.Label, CancellationRate(inBucket)));
            }
            return points;
        }

        // No-show rate for each bucket. Needs "now" to know which due dates have passed.
        private static List<RatePoint> NoShowSeries(
            List<Reservation> reservations, List<Bucket> buckets, DateTime now)
        {
            var points = new List<RatePoint>();
            foreach (var bucket in buckets)
            {
                var inBucket = reservations.Where(r => IsIn(r, bucket)).ToList();
                points.Add(new RatePoint(bucket.Label, NoShowRate(inBucket, now)));
            }
            return points;
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
            List<Bucket> weeks,
            Bucket window)
        {
            var utilisation = new List<ToolUtilisation>();
            var damage = new List<ToolDamage>();
            var demand = new List<ToolDemand>();

            var daysInWindow = (window.End - window.Start).TotalDays;

            foreach (var tool in tools)
            {
                var forTool = reservations.Where(r => r.ToolId == tool.Id).ToList();

                // How many days this tool was actually booked out.
                var bookedDays = forTool
                    .Where(r => r.Status != "cancelled")
                    .Sum(r => OverlapDays(r.StartDay, r.EndDay, window.Start, window.End));

                utilisation.Add(new ToolUtilisation(
                    tool.Id,
                    tool.Name,
                    Math.Round(bookedDays * 100.0 / daysInWindow, 1)));

                var incidentCount = incidents.Count(i =>
                    i.ToolId == tool.Id
                    && i.CreatedAt != null
                    && i.CreatedAt >= window.Start
                    && i.CreatedAt < window.End);

                damage.Add(new ToolDamage(tool.Id, tool.Name, incidentCount));

                // Cancellations still count here - someone wanted the tool.
                demand.Add(new ToolDemand(tool.Id, tool.Name, forTool.Count));
            }

            // The last 12 weeks as one span, for the weekly view of revenue by tool.
            var lastTwelveWeeks = new Bucket("12 weeks", weeks[0].Start, weeks[^1].End);

            // Biggest bar first, so the charts read top to bottom.
            return new ToolMetrics(
                utilisation.OrderByDescending(t => t.UtilisationRate).ToList(),
                damage.OrderByDescending(t => t.DamageCount).ToList(),
                demand.OrderByDescending(t => t.RequestCount).ToList(),
                new Ranged<ToolRevenue>(
                    RevenueByTool(reservations, tools, lastTwelveWeeks),
                    RevenueByTool(reservations, tools, window)));
        }

        // Money each tool brought in over one span, biggest first.
        // Cancelled bookings took no money, and tools that earned nothing are
        // left out so the pie chart has no empty slices.
        private static List<ToolRevenue> RevenueByTool(
            List<Reservation> reservations, List<Tool> tools, Bucket span)
        {
            var charged = reservations
                .Where(r => r.Status != "cancelled" && IsIn(r, span))
                .ToList();

            return tools
                .Select(tool => new ToolRevenue(
                    tool.Id,
                    tool.Name,
                    charged.Where(r => r.ToolId == tool.Id).Sum(r => r.AmountCharged)))
                .Where(t => t.Amount > 0)
                .OrderByDescending(t => t.Amount)
                .ToList();
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