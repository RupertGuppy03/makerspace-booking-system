/**
 * "Bookings that never happened" - cancellations and no-shows on one chart.
 *
 * Cancelled and no-show are two ways the same thing goes wrong, so they share
 * a set of axes rather than getting a card each.
 *
 * Lives in its own file because both the manager dashboard and the admin
 * dashboard show it. Hand it the figures and it draws itself; it does no
 * fetching of its own.
 */

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DashboardMetrics } from '../../types/metrics';
import ManagementMetricCard from './ManagementMetricCard';
import ManagementTimeRange from './ManagementTimeRange';
import type { TimeRange } from './ManagementTimeRange';
import {
    CHART_COLOURS, AXIS, PERIOD_AXIS, CHART_MARGIN,
    everyNthPeriod, periodLabel, percentTooltip,
} from './managementChartTheme';

type Props = {
    metrics: DashboardMetrics | null;
    loading: boolean;
    error: string | null;
    range: TimeRange;
    onRangeChange: (range: TimeRange) => void;
    // How tall the chart area is. Bigger when the card spans the full width.
    height?: number;
};

function ManagementFailedBookingsCard({ metrics, loading, error, range, onRangeChange, height = 280 }: Props) {
    // Recharts needs arrays, never null, so fall back to empty ones.
    // [range] picks either the .week or the .month list.
    const cancellationTrend = metrics?.userMetrics.cancellationTrend[range] ?? [];
    const noShowTrend = metrics?.userMetrics.noShowTrend[range] ?? [];

    /*
     * The API returns the two as separate lists covering the same periods, so
     * we stitch them into a single row per period - which is the shape Recharts
     * needs to draw two lines on one set of axes.
     */
    const failedBookings = cancellationTrend.map((point, index) => ({
        period: point.period,
        cancelled: point.rate,
        noShow: noShowTrend[index]?.rate ?? 0,
    }));

    return (
        <ManagementMetricCard
            title="Bookings that never happened"
            definition={`Cancelled bookings were called off in advance. No-shows were never collected and never cancelled, so they hold a tool nobody else could book. Shown per ${range} over the last 12 ${range}s.`}
            loading={loading}
            error={error}
            isEmpty={failedBookings.length === 0}
            height={height}
            action={<ManagementTimeRange value={range} onChange={onRangeChange} />}
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
    );
}

export default ManagementFailedBookingsCard;
