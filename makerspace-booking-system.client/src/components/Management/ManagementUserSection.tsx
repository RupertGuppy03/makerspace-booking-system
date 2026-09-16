/**
 * The User section of the manager dashboard: how reliable borrowers are.
 * Whether tools come back on time, how late they are when they are late, and
 * how many bookings never happen at all.
 *
 * Figures arrive from /api/management/metrics. Where a metric has no data yet
 * the card says so rather than drawing a chart of zeroes.
 */

import { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useOutletContext } from 'react-router-dom';
import type { DashboardMetricsState } from '../../pages/Management/useDashboardMetrics';
import ManagementMetricCard from './ManagementMetricCard';
import ManagementStatCard from './ManagementStatCard';
import ManagementTimeRange from './ManagementTimeRange';
import type { TimeRange } from './ManagementTimeRange';
import {
    CHART_COLOURS, AXIS, PERIOD_AXIS, CHART_MARGIN, BAR_CURSOR,
    everyNthPeriod, periodLabel, formatPercent, percentTooltip, daysTooltip,
} from './managementChartTheme';

function ManagementUserSection() {
    /*
     * The figures are fetched once by ManagementPage, the frame this section
     * sits inside. useOutletContext reads what that frame passed down.
     */
    const { metrics, loading, error } = useOutletContext<DashboardMetricsState>();

    /*
     * Whether the charts show weeks or months. All three charts share this one
     * value, so clicking any of their switches moves all three together.
     */
    const [range, setRange] = useState<TimeRange>('month');

    // The same switch, handed to each chart card.
    const rangeSwitch = <ManagementTimeRange value={range} onChange={setRange} />;

    // Recharts needs arrays, never null, so fall back to empty ones.
    // [range] picks either the .week or the .month list for the charts.
    const onTimeReturnTrend = metrics?.userMetrics.onTimeReturnTrend[range] ?? [];
    const averageOverdueTrend = metrics?.userMetrics.averageOverdueTrend[range] ?? [];
    const cancellationTrend = metrics?.userMetrics.cancellationTrend[range] ?? [];
    const noShowTrend = metrics?.userMetrics.noShowTrend[range] ?? [];

    // The small sparklines in the headline cards always show months, to match
    // their 12-month figures.
    const onTimeByMonth = metrics?.userMetrics.onTimeReturnTrend.month ?? [];
    const overdueByMonth = metrics?.userMetrics.averageOverdueTrend.month ?? [];
    const cancellationByMonth = metrics?.userMetrics.cancellationTrend.month ?? [];
    const noShowByMonth = metrics?.userMetrics.noShowTrend.month ?? [];

    /*
     * Cancellations and no-shows are two ways the same thing goes wrong, so
     * they share one chart. The API returns them as two separate lists covering
     * the same periods, so we stitch them into a single row per period — which
     * is the shape Recharts needs to draw two lines on one set of axes.
     */
    const failedBookings = cancellationTrend.map((point, index) => ({
        period: point.period,
        cancelled: point.rate,
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
                        trend={onTimeByMonth.map((point) => point.rate)}
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
                        trend={overdueByMonth.map((point) => point.duration)}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="blue"
                        label="Cancelled"
                        value={metrics === null ? null : formatPercent(metrics.userMetrics.cancellationRate)}
                        note="Called off before collection"
                        trend={cancellationByMonth.map((point) => point.rate)}
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="sky"
                        label="No-shows"
                        value={metrics === null ? null : formatPercent(metrics.userMetrics.noShowRate)}
                        note="Never collected, never cancelled"
                        trend={noShowByMonth.map((point) => point.rate)}
                    />
                </div>
            </div>

            {/* ---------- cancellations and no-shows together ---------- */}
            <div className="mb-4">
                <ManagementMetricCard
                    title="Bookings that never happened"
                    definition={`Cancelled bookings were called off in advance. No-shows were never collected and never cancelled, so they hold a tool nobody else could book. Shown per ${range} over the last 12 ${range}s.`}
                    loading={loading}
                    error={error}
                    isEmpty={failedBookings.length === 0}
                    height={280}
                    action={rangeSwitch}
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
                                dataKey="period"
                                {...PERIOD_AXIS}
                                ticks={everyNthPeriod(failedBookings.map((p) => p.period), 2)}
                            />
                            <YAxis {...AXIS} unit="%" />
                            <Tooltip formatter={percentTooltip} labelFormatter={periodLabel} />
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
                        definition={`Share of returned bookings given back on or before their end date, per ${range}.`}
                        loading={loading}
                        error={error}
                        isEmpty={onTimeReturnTrend.length === 0}
                        height={210}
                        action={rangeSwitch}
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
                                    dataKey="period"
                                    {...PERIOD_AXIS}
                                    ticks={everyNthPeriod(onTimeReturnTrend.map((p) => p.period), 3)}
                                />
                                <YAxis {...AXIS} unit="%" />
                                <Tooltip formatter={percentTooltip} labelFormatter={periodLabel} />
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
                        definition={`Average days past the end date per ${range}, counting only bookings that were actually returned late.`}
                        loading={loading}
                        error={error}
                        isEmpty={
                            averageOverdueTrend.length === 0 ||
                            allZero(averageOverdueTrend.map((point) => point.duration))
                        }
                        height={210}
                        action={rangeSwitch}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={averageOverdueTrend} margin={CHART_MARGIN}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="period"
                                    {...PERIOD_AXIS}
                                    ticks={everyNthPeriod(averageOverdueTrend.map((p) => p.period), 3)}
                                />
                                <YAxis {...AXIS} unit="d" />
                                <Tooltip cursor={BAR_CURSOR} formatter={daysTooltip} labelFormatter={periodLabel} />
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
