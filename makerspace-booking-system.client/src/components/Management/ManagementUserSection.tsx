/**
 * The User section of the manager dashboard: how reliable borrowers are.
 * Whether tools come back on time, how late they are when they are late, and
 * how many bookings never happen at all.
 *
 * Figures arrive from /api/management/metrics. Where a metric has no data yet
 * the card says so rather than drawing a chart of zeroes.
 *
 * Two of the cards below are shared with the admin dashboard, so they live in
 * their own files and are dropped in here as one line each.
 */

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOutletContext } from 'react-router-dom';
import type { DashboardMetricsState } from '../../pages/Management/useDashboardMetrics';
import ManagementMetricCard from './ManagementMetricCard';
import ManagementStatCard from './ManagementStatCard';
import ManagementTimeRange from './ManagementTimeRange';
import type { TimeRange } from './ManagementTimeRange';
import ManagementFailedBookingsCard from './ManagementFailedBookingsCard';
import ManagementOnTimeReturnCard from './ManagementOnTimeReturnCard';
import {
    CHART_COLOURS, AXIS, PERIOD_AXIS, CHART_MARGIN, BAR_CURSOR,
    everyNthPeriod, periodLabel, formatPercent, daysTooltip,
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

    // Recharts needs arrays, never null, so fall back to empty ones.
    // [range] picks either the .week or the .month list for the chart.
    const averageOverdueTrend = metrics?.userMetrics.averageOverdueTrend[range] ?? [];

    // The small sparklines in the headline cards always show months, to match
    // their 12-month figures.
    const onTimeByMonth = metrics?.userMetrics.onTimeReturnTrend.month ?? [];
    const overdueByMonth = metrics?.userMetrics.averageOverdueTrend.month ?? [];
    const cancellationByMonth = metrics?.userMetrics.cancellationTrend.month ?? [];
    const noShowByMonth = metrics?.userMetrics.noShowTrend.month ?? [];

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
                <ManagementFailedBookingsCard
                    metrics={metrics}
                    loading={loading}
                    error={error}
                    range={range}
                    onRangeChange={setRange}
                    height={280}
                />
            </div>

            {/* ---------- returns ---------- */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <ManagementOnTimeReturnCard
                        metrics={metrics}
                        loading={loading}
                        error={error}
                        range={range}
                        onRangeChange={setRange}
                        height={210}
                    />
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
                        action={<ManagementTimeRange value={range} onChange={setRange} />}
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
