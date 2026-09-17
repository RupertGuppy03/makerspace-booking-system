
// One point on a chart. "period" is the axis label - a month ("Sep 25") or a week ("15 Sep").
export type RevenuePoint = {
    period: string;
    amount: number;
};

export type RatePoint = {
    period: string;
    rate: number;
};

export type DurationPoint = {
    period: string;
    duration: number;
};

// The same series worked out per week and per month, so a chart's Week / Month
// switch can flip between them without fetching again.
export type Ranged<T> = {
    week: T[];
    month: T[];
};

// revenue tab
export type ToolRepairCost = {
    toolId: number;
    toolName: string;
    repairCost: number;
};

export type RevenueMetrics = {
    totalRevenue: number;
    revenueTrend: Ranged<RevenuePoint>;
    repairCosts: ToolRepairCost[];
};

// user tab
export type UserMetrics = {
    onTimeReturnRate: number;
    averageOverdueDays: number;
    cancellationRate: number;
    noShowRate: number;

    onTimeReturnTrend: Ranged<RatePoint>;
    averageOverdueTrend: Ranged<DurationPoint>;
    cancellationTrend: Ranged<RatePoint>;
    noShowTrend: Ranged<RatePoint>;
};

// tool tab
export type ToolUtilisation = {
    toolId: number;
    toolName: string;
    utilisationRate: number;
};

export type ToolDamage = {
    toolId: number;
    toolName: string;
    damageCount: number;
};

export type ToolDemand = {
    toolId: number;
    toolName: string;
    requestCount: number;
};

export type ToolRevenue = {
    toolId: number;
    toolName: string;
    amount: number;
};

export type ToolMetrics = {
    utilisationMetrics: ToolUtilisation[];
    damageMetrics: ToolDamage[];
    demandMetrics: ToolDemand[];
    revenueByTool: Ranged<ToolRevenue>;
};

// everything the dashboard needs, in one response
export type DashboardMetrics = {
    revenueMetrics: RevenueMetrics;
    userMetrics: UserMetrics;
    toolMetrics: ToolMetrics;
};
