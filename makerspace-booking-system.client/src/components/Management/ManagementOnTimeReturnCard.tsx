/**
 * "Returned on time" - the share of bookings handed back on or before their
 * end date, over time.
 *
 * Shared by the manager dashboard and the admin dashboard. Hand it the figures
 * and it draws itself; it does no fetching of its own.
 */

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    height?: number;
};

function ManagementOnTimeReturnCard({ metrics, loading, error, range, onRangeChange, height = 210 }: Props) {
    // Recharts needs arrays, never null. [range] picks the week or month list.
    const onTimeReturnTrend = metrics?.userMetrics.onTimeReturnTrend[range] ?? [];

    return (
        <ManagementMetricCard
            title="Returned on time"
            definition={`Share of returned bookings given back on or before their end date, per ${range}.`}
            loading={loading}
            error={error}
            isEmpty={onTimeReturnTrend.length === 0}
            height={height}
            action={<ManagementTimeRange value={range} onChange={onRangeChange} />}
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
    );
}

export default ManagementOnTimeReturnCard;
