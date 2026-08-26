namespace makerspace_booking_system.Server.Models
{
    /**

    these are the metrics that will be displayed on the management dashboard. 
    They are calculated from the database and returned as a single object.

    */

    public record MonthlyRevenue(string Month, decimal Amount);
     public record MonthlyRate(string Month, double Rate);

     public record MonthlyDuration(string Month, double Duration);

     // revenue tab

     public record RevenueMetrics(
        decimal TotalRevenue,
        List<MonthlyRevenue> MonthlyRevenue
    );
    // user tab
    public record UserMetrics(
        double OnTimeReturnRate,
        double AverageOverdueDays,
        double CancellationRate,
        double NoShowRate,
        List<MonthlyRate> OnTimeReturnTrend,
        List<MonthlyDuration> AverageOverdueTrend,
        List<MonthlyRate> CancellationTrend,
        List<MonthlyRate> NoShowTrend
    );
    // tool tab
    public record ToolUtilisation(int ToolId, string ToolName, double UtilisationRate);
    public record ToolDamage(int ToolId, string ToolName, int DamageCount);
    public record ToolDemand(int ToolId, string ToolName, int RequestCount);

    public record ToolMetrics(
        List<ToolUtilisation> UtilisationMetrics,
        List<ToolDamage> DamageMetrics,
        List<ToolDemand> DemandMetrics
    );
    // whole payload so we only need to request on object per page load
    public record DashboardMetrics(
        RevenueMetrics RevenueMetrics,
        UserMetrics UserMetrics,
        ToolMetrics ToolMetrics
    );
}
    


