namespace makerspace_booking_system.Server.Models
{
    /**

    these are the metrics that will be displayed on the management dashboard. 
    They are calculated from the database and returned as a single object.

    */


    public record RevenuePoint(string Period, decimal Amount);
    public record RatePoint(string Period, double Rate);
    public record DurationPoint(string Period, double Duration);

    public record Ranged<T>(List<T> Week, List<T> Month);

     // revenue tab
    public record ToolRepairCost(int ToolId, string ToolName, decimal RepairCost);
     public record RevenueMetrics(
        decimal TotalRevenue,
        Ranged<RevenuePoint> RevenueTrend,
        List<ToolRepairCost> RepairCosts
    );
    // user tab
    public record UserMetrics(
        double OnTimeReturnRate,
        double AverageOverdueDays,
        double CancellationRate,
        double NoShowRate,
        Ranged<RatePoint> OnTimeReturnTrend,
        Ranged<DurationPoint> AverageOverdueTrend,
        Ranged<RatePoint> CancellationTrend,
        Ranged<RatePoint> NoShowTrend
    );
    // tool tab
    public record ToolUtilisation(int ToolId, string ToolName, double UtilisationRate);
    public record ToolDamage(int ToolId, string ToolName, int DamageCount);
    public record ToolDemand(int ToolId, string ToolName, int RequestCount);
    public record ToolRevenue(int ToolId, string ToolName, decimal Amount);

    public record ToolMetrics(
        List<ToolUtilisation> UtilisationMetrics,
        List<ToolDamage> DamageMetrics,
        List<ToolDemand> DemandMetrics,
        Ranged<ToolRevenue> RevenueByTool
    );
    // whole payload so we only need to request on object per page load
    public record DashboardMetrics(
        RevenueMetrics RevenueMetrics,
        UserMetrics UserMetrics,
        ToolMetrics ToolMetrics
    );
}
    


