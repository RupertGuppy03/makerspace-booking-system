/**
 * The Revenue section of the manager dashboard: what the makerspace took in
 * over the last 12 months, which months earned the most, and what maintenance
 * cost over the same period.
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
    CHART_COLOURS, CATEGORY_COLOURS, AXIS, MONTH_AXIS, CHART_MARGIN, BAR_CURSOR,
    everyNthMonth, monthLabel, formatMoney, moneyTick, moneyTooltip,
} from './managementChartTheme';

function ManagementRevenueSection() {
    /*
     * The figures are fetched once by ManagementPage, the frame this section
     * sits inside. useOutletContext reads what that frame passed down, so this
     * section does not fetch anything itself.
     */
    const { metrics, loading, error } = useOutletContext<DashboardMetricsState>();

    /*
     * Which time range the line chart is showing. Only 'month' can be drawn at
     * the moment, because the API returns one point per month for 12 months.
     */
    const [range, setRange] = useState<TimeRange>('month');

    // Recharts needs an array, never null, so fall back to an empty one.
    const monthlyRevenue = metrics?.revenueMetrics.monthlyRevenue ?? [];
    const totalRevenue = metrics?.revenueMetrics.totalRevenue ?? 0;

    // The strongest month of the year, used for a headline figure.
    const bestMonth = monthlyRevenue.reduce<typeof monthlyRevenue[number] | null>(
        (best, current) => (best === null || current.amount > best.amount ? current : best),
        null
    );

    const latestMonth = monthlyRevenue[monthlyRevenue.length - 1] ?? null;
    const averagePerMonth =
        monthlyRevenue.length === 0 ? 0 : totalRevenue / monthlyRevenue.length;

    /*
     * The doughnut would be unreadable with twelve slices, so we name the four
     * biggest months and group everything else into a single "Other" slice.
     */
    const byAmount = [...monthlyRevenue].sort((a, b) => b.amount - a.amount);
    const topMonths = byAmount.slice(0, 4);
    const otherTotal = byAmount.slice(4).reduce((sum, month) => sum + month.amount, 0);

    const shareSlices = [
        ...topMonths.map((month, index) => ({
            label: month.month,
            value: month.amount,
            colour: CATEGORY_COLOURS[index],
        })),
        ...(otherTotal > 0
            ? [{ label: 'Other months', value: otherTotal, colour: CHART_COLOURS.grey }]
            : []),
    ];

    const hasRevenue = monthlyRevenue.some((month) => month.amount > 0);

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
                        trend={monthlyRevenue.map((month) => month.amount)}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="green"
                        label="Best month"
                        value={bestMonth === null ? null : bestMonth.month}
                        note={bestMonth === null ? 'No bookings yet' : `${formatMoney(bestMonth.amount)} taken`}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="amber"
                        label="Average per month"
                        value={metrics === null ? null : formatMoney(averagePerMonth)}
                        note="Total shared across 12 months"
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="sky"
                        label="Most recent month"
                        value={latestMonth === null ? null : formatMoney(latestMonth.amount)}
                        note={latestMonth === null ? 'No bookings yet' : latestMonth.month}
                    />
                </div>
            </div>

            {/* ---------- revenue over time ---------- */}
            <div className="mb-4">
                <ManagementMetricCard
                    title="Revenue over time"
                    definition="Total charged on bookings that started in each month. Cancelled bookings are excluded."
                    loading={loading}
                    error={error}
                    isEmpty={!hasRevenue}
                    height={270}
                    action={
                        <ManagementTimeRange
                            value={range}
                            onChange={setRange}
                            available={['month']}
                        />
                    }
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyRevenue} margin={CHART_MARGIN}>
                            {/* A gradient that fades the fill out towards the bottom. */}
                            <defs>
                                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLOURS.blue} stopOpacity={0.28} />
                                    <stop offset="100%" stopColor={CHART_COLOURS.blue} stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="month"
                                {...MONTH_AXIS}
                                ticks={everyNthMonth(monthlyRevenue.map((m) => m.month), 2)}
                            />
                            <YAxis {...AXIS} tickFormatter={moneyTick} />
                            <Tooltip formatter={moneyTooltip} labelFormatter={monthLabel} />
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
                        definition="Share of the year's revenue by month. The four strongest months are named and the rest grouped together."
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
                        /*
                         * Repair cost is recorded against each damage incident in the
                         * database, but the metrics endpoint does not return it yet, so
                         * this card stays empty on purpose rather than showing a guess.
                         */
                        definition="Repair spend per tool over 12 months, from logged damage incidents. Waiting on the dashboard API to return repair costs."
                        loading={loading}
                        error={error}
                        isEmpty
                        height={210}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={[]} margin={CHART_MARGIN}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" {...AXIS} />
                                <YAxis type="category" dataKey="toolName" width={120} {...AXIS} />
                                <Tooltip cursor={BAR_CURSOR} />
                                <Bar dataKey="repairCost" fill={CHART_COLOURS.rose} radius={4} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>
                </div>
            </div>
        </div>
    );
}

export default ManagementRevenueSection;
