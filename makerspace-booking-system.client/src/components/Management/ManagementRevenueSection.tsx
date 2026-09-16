/**
 * The Revenue section of the manager dashboard: what the makerspace took in
 * week by week or month by month, which periods earned the most, and what
 * repairs cost over the last 12 months.
 *
 * Figures arrive from /api/management/metrics. Where a metric has no data yet
 * the card says so rather than drawing a chart of zeroes.
 */

import { useState } from 'react';
import {
    AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useOutletContext } from 'react-router-dom';
import type { DashboardMetricsState } from '../../pages/Management/useDashboardMetrics';
import ManagementMetricCard from './ManagementMetricCard';
import ManagementStatCard from './ManagementStatCard';
import ManagementRankedList from './ManagementRankedList';
import ManagementTimeRange from './ManagementTimeRange';
import type { TimeRange } from './ManagementTimeRange';
import {
    CHART_COLOURS, CATEGORY_COLOURS, AXIS, PERIOD_AXIS, CHART_MARGIN, BAR_CURSOR,
    everyNthPeriod, periodLabel, formatMoney, moneyTick, moneyTooltip,
} from './managementChartTheme';

function ManagementRevenueSection() {
    /*
     * The figures are fetched once by ManagementPage, the frame this section
     * sits inside. useOutletContext reads what that frame passed down, so this
     * section does not fetch anything itself.
     */
    const { metrics, loading, error } = useOutletContext<DashboardMetricsState>();

    /*
     * Whether the page is showing weeks or months. Changing it re-draws the page
     * using the other list the API already sent, so nothing is fetched again.
     */
    const [range, setRange] = useState<TimeRange>('month');

    // Recharts needs an array, never null, so fall back to an empty one.
    // [range] picks either the .week or the .month list.
    const revenueTrend = metrics?.revenueMetrics.revenueTrend[range] ?? [];
    const monthlyTrend = metrics?.revenueMetrics.revenueTrend.month ?? [];
    const repairCosts = metrics?.revenueMetrics.repairCosts ?? [];
    const totalRevenue = metrics?.revenueMetrics.totalRevenue ?? 0;

    // Total for just the periods on screen: 12 weeks or 12 months.
    const shownTotal = revenueTrend.reduce((sum, point) => sum + point.amount, 0);

    // The strongest period on screen, used for a headline figure.
    const bestPeriod = revenueTrend.reduce<typeof revenueTrend[number] | null>(
        (best, current) => (best === null || current.amount > best.amount ? current : best),
        null
    );

    const latestPeriod = revenueTrend[revenueTrend.length - 1] ?? null;
    const averagePerPeriod = revenueTrend.length === 0 ? 0 : shownTotal / revenueTrend.length;

    /*
     * The doughnut would be unreadable with twelve slices, so we name the four
     * biggest periods and group everything else into a single "Other" slice.
     */
    const byAmount = [...revenueTrend].sort((a, b) => b.amount - a.amount);
    const topPeriods = byAmount.slice(0, 4);
    const otherTotal = byAmount.slice(4).reduce((sum, point) => sum + point.amount, 0);

    const shareSlices = [
        ...topPeriods.map((point, index) => ({
            label: point.period,
            value: point.amount,
            colour: CATEGORY_COLOURS[index],
        })),
        ...(otherTotal > 0
            ? [{ label: `Other ${range}s`, value: otherTotal, colour: CHART_COLOURS.grey }]
            : []),
    ];

    const hasRevenue = revenueTrend.some((point) => point.amount > 0);

    return (
        <div>
            {/* ---------- headline figures ---------- */}
            <div className="row g-4 mb-4">
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="blue"
                        label="Revenue, 12 months"
                        value={metrics === null ? null : formatMoney(totalRevenue)}
                        note="Across all paid bookings"
                        trend={monthlyTrend.map((point) => point.amount)}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="green"
                        label={`Best ${range}`}
                        value={bestPeriod === null ? null : bestPeriod.period}
                        note={bestPeriod === null ? 'No bookings yet' : `${formatMoney(bestPeriod.amount)} taken`}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="amber"
                        label={`Average per ${range}`}
                        value={metrics === null ? null : formatMoney(averagePerPeriod)}
                        note={`Over the last 12 ${range}s`}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="sky"
                        label={`Most recent ${range}`}
                        value={latestPeriod === null ? null : formatMoney(latestPeriod.amount)}
                        note={latestPeriod === null ? 'No bookings yet' : latestPeriod.period}
                    />
                </div>
            </div>

            {/* ---------- revenue over time ---------- */}
            <div className="mb-4">
                <ManagementMetricCard
                    title="Revenue over time"
                    definition={`Total charged on bookings that started in each ${range}, over the last 12 ${range}s. Cancelled bookings are excluded.`}
                    loading={loading}
                    error={error}
                    isEmpty={!hasRevenue}
                    height={270}
                    action={<ManagementTimeRange value={range} onChange={setRange} />}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueTrend} margin={CHART_MARGIN}>
                            {/* A gradient that fades the fill out towards the bottom. */}
                            <defs>
                                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLOURS.blue} stopOpacity={0.28} />
                                    <stop offset="100%" stopColor={CHART_COLOURS.blue} stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="period"
                                {...PERIOD_AXIS}
                                ticks={everyNthPeriod(revenueTrend.map((p) => p.period), 2)}
                            />
                            <YAxis {...AXIS} tickFormatter={moneyTick} />
                            <Tooltip formatter={moneyTooltip} labelFormatter={periodLabel} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                name="Total revenue"
                                stroke={CHART_COLOURS.blue}
                                strokeWidth={2.5}
                                fill="url(#revenueFill)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ManagementMetricCard>
            </div>

            {/* ---------- share of revenue, and costs ---------- */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <ManagementMetricCard
                        title="Where the money came from"
                        definition={`Share of revenue by ${range}, over the last 12 ${range}s. The four strongest are named and the rest grouped together.`}
                        loading={loading}
                        error={error}
                        isEmpty={!hasRevenue}
                        height={210}
                    >
                        <div className="row align-items-center h-100">
                            <div className="col-sm-7 h-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={shareSlices}
                                            dataKey="value"
                                            nameKey="label"
                                            innerRadius="62%"
                                            outerRadius="100%"
                                            stroke="none"
                                        >
                                            {/* Cell colours each slice individually. */}
                                            {shareSlices.map((slice) => (
                                                <Cell key={slice.label} fill={slice.colour} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={moneyTooltip} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="col-sm-5">
                                <ManagementRankedList items={shareSlices} />
                            </div>
                        </div>
                    </ManagementMetricCard>
                </div>

                <div className="col-lg-6">
                    <ManagementMetricCard
                        title="Biggest costs"
                        definition="Repair spend per tool over the last 12 months, from logged damage incidents. Damage is rare, so this always covers 12 months."
                        loading={loading}
                        error={error}
                        isEmpty={repairCosts.length === 0}
                        height={210}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={repairCosts} margin={CHART_MARGIN}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" {...AXIS} tickFormatter={moneyTick} />
                                <YAxis type="category" dataKey="toolName" width={120} {...AXIS} />
                                <Tooltip cursor={BAR_CURSOR} formatter={moneyTooltip} />
                                <Bar
                                    dataKey="repairCost"
                                    name="Repair cost"
                                    fill={CHART_COLOURS.rose}
                                    radius={4}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>
                </div>
            </div>
        </div>
    );
}

export default ManagementRevenueSection;
