
// different types for each monthly metric, used for the metrics page
export type MonthyRevenue = {
    month: string;
    amount: number;
};

export type MonthlyRate = {
    month: string;
    rate: number;
};

export type MonthlyDuration = {
    month: string;
    duration: number;
};
// revenue tab
export type RevenueMetrics = {
    totalRevenue: number;
    monthlyRevenue: MonthyRevenue[];
};

export type UserMetrics = {
    onTimeReturnRate: number;
    averageOverdueDays: number;
    cancellationRate: number;
    noShowRate: number;

    onTimeReturnTrend: MonthlyRate[];
    averageOverdueTrend: MonthlyDuration[];
    cancellationTrend: MonthlyRate[];
    noShowTrend: MonthlyRate[];
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
}

export type ToolDemand = {
    toolId: number;
    toolName: string;
    requestCount: number;
}

export type ToolMetrics = {
    utilisationMetrics: ToolUtilisation[];
    damageMetrics: ToolDamage[];
    demandMetrics: ToolDemand[];
};

// everything else the dashbaord needs
export type DashboardMetrics = {
    revenueMetrics: RevenueMetrics;
    userMetrics: UserMetrics;
    toolMetrics: ToolMetrics;
};



