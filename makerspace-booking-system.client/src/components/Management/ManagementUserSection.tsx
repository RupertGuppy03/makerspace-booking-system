/**
 * The User section of the manager dashboard: how reliable borrowers are.
 * Whether tools come back on time, how late they are when they are late, and
 * how many bookings never happen at all.
 *
 * Figures arrive from /api/management/metrics. Where a metric has no data yet
 * the card says so rather than drawing a chart of zeroes.
 */

import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useOutletContext } from 'react-router-dom';
import type { DashboardMetricsState } from '../../pages/Management/useDashboardMetrics';
import ManagementMetricCard from './ManagementMetricCard';
import ManagementStatCard from './ManagementStatCard';
import {
    CHART_COLOURS, AXIS, MONTH_AXIS, CHART_MARGIN, BAR_CURSOR,
    everyNthMonth, monthLabel, formatPercent, percentTooltip, daysTooltip,
} from './managementChartTheme';

function ManagementUserSection() {
    /*
     * The figures are fetched once by ManagementPage, the frame this section
     * sits inside. useOutletContext reads what that frame passed down.
     */
    const { metrics, loading, error } = useOutletContext<DashboardMetricsState>();

    // Recharts needs arrays, never null, so fall back to empty ones.
    const onTimeReturnTrend = metrics?.userMetrics.onTimeReturnTrend ?? [];
    const averageOverdueTrend = metrics?.userMetrics.averageOverdueTrend ?? [];
    const cancellationTrend = metrics?.userMetrics.cancellationTrend ?? [];
    const noShowTrend = metrics?.userMetrics.noShowTrend ?? [];

    /*
     * Cancellations and no-shows are two ways the same thing goes wrong, so
     * they share one chart. The API returns them as two separate lists covering
     * the same months, so we stitch them into a single row per month — which is
     * the shape Recharts needs to draw two lines on one set of axes.
     */
    const failedBookings = cancellationTrend.map((month, index) => ({
        month: month.month,
        cancelled: month.rate,
        noShow: noShowTrend[index]?.rate ?? 0,
    }));

    // True when every figure in a list is zero, which means nothing to draw.
    const allZero = (values: number[]) => values.every((value) => value === 0);

    return (
        <div>
            {/* ---------- headline figures ---------- */}
            <div className="row g-4 mb-4">
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="green"
                        label="Returned on time"
                        value={metrics === null ? null : formatPercent(metrics.userMetrics.onTimeReturnRate)}
                        note="Of all returned bookings"
                        trend={onTimeReturnTrend.map((month) => month.rate)}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="amber"
                        label="Average overdue"
                        value={
                            metrics === null
                                ? null
                                : `${metrics.userMetrics.averageOverdueDays.toFixed(1)} days`
                        }
                        note="Counting late returns only"
                        trend={averageOverdueTrend.map((month) => month.duration)}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="blue"
                        label="Cancelled"
                        value={metrics === null ? null : formatPercent(metrics.userMetrics.cancellationRate)}
                        note="Called off before collection"
                        trend={cancellationTrend.map((month) => month.rate)}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="sky"
                        label="No-shows"
                        value={metrics === null ? null : formatPercent(metrics.userMetrics.noShowRate)}
                        note="Never collected, never cancelled"
                        trend={noShowTrend.map((month) => month.rate)}
                    />
                </div>
            </div>

            {/* ---------- cancellations and no-shows together ---------- */}
            <div className="mb-4">
                <ManagementMetricCard
                    title="Bookings that never happened"
                    definition="Cancelled bookings were called off in advance. No-shows were never collected and never cancelled, so they hold a tool nobody else could book."
                    loading={loading}
                    error={error}
                    isEmpty={failedBookings.length === 0}
                    height={280}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={failedBookings} margin={CHART_MARGIN}>
                            <defs>
                                <linearGradient id="cancelledFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLOURS.blue} stopOpacity={0.26} />
                                    <stop offset="100%" stopColor={CHART_COLOURS.blue} stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="noShowFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLOURS.rose} stopOpacity={0.26} />
                                    <stop offset="100%" stopColor={CHART_COLOURS.rose} stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                    dataKey="month"
                                    {...MONTH_AXIS}
                                    ticks={everyNthMonth(failedBookings.map((m) => m.month), 2)}
                                />
                            <YAxis {...AXIS} unit="%" />
                            <Tooltip formatter={percentTooltip} labelFormatter={monthLabel} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="cancelled"
                                name="Cancelled"
                                stroke={CHART_COLOURS.blue}
                                strokeWidth={2.5}
                                fill="url(#cancelledFill)"
                            />
                            <Area
                                type="monotone"
                                dataKey="noShow"
                                name="No-show"
                                stroke={CHART_COLOURS.rose}
                                strokeWidth={2.5}
                                fill="url(#noShowFill)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ManagementMetricCard>
            </div>

            {/* ---------- returns ---------- */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <ManagementMetricCard
                        title="Returned on time"
                        definition="Share of returned bookings given back on or before their end date."
                        loading={loading}
                        error={error}
                        isEmpty={onTimeReturnTrend.length === 0}
                        height={210}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={onTimeReturnTrend} margin={CHART_MARGIN}>
                                <defs>
                                    <linearGradient id="onTimeFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CHART_COLOURS.green} stopOpacity={0.28} />
                                        <stop offset="100%" stopColor={CHART_COLOURS.green} stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    {...MONTH_AXIS}
                                    ticks={everyNthMonth(onTimeReturnTrend.map((m) => m.month), 3)}
                                />
                                <YAxis {...AXIS} unit="%" />
                                <Tooltip formatter={percentTooltip} labelFormatter={monthLabel} />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    name="On time"
                                    stroke={CHART_COLOURS.green}
                                    strokeWidth={2.5}
                                    fill="url(#onTimeFill)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>
                </div>

                <div className="col-lg-6">
                    <ManagementMetricCard
                        title="How late, when late"
                        definition="Average days past the end date, counting only bookings that were actually returned late."
                        loading={loading}
                        error={error}
                        isEmpty={
                            averageOverdueTrend.length === 0 ||
                            allZero(averageOverdueTrend.map((month) => month.duration))
                        }
                        height={210}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={averageOverdueTrend} margin={CHART_MARGIN}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    {...MONTH_AXIS}
                                    ticks={everyNthMonth(averageOverdueTrend.map((m) => m.month), 3)}
                                />
                                <YAxis {...AXIS} unit="d" />
                                <Tooltip cursor={BAR_CURSOR} formatter={daysTooltip} labelFormatter={monthLabel} />
                                <Bar
                                    dataKey="duration"
                                    name="Days overdue"
                                    fill={CHART_COLOURS.amber}
                                    radius={4}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>
                </div>
            </div>
        </div>
    );
}

export default ManagementUserSection;
