/**
 * "Most requested" - how many bookings each tool has had.
 *
 * Shared by the manager dashboard and the admin dashboard. Hand it the figures
 * and it draws itself; it does no fetching of its own.
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardMetrics } from '../../types/metrics';
import ManagementMetricCard from './ManagementMetricCard';
import { CHART_COLOURS, AXIS, CHART_MARGIN, BAR_CURSOR } from './managementChartTheme';

type Props = {
    metrics: DashboardMetrics | null;
    loading: boolean;
    error: string | null;
    height?: number;
};

function ManagementDemandCard({ metrics, loading, error, height = 220 }: Props) {
    const demandMetrics = metrics?.toolMetrics.demandMetrics ?? [];

    return (
        <ManagementMetricCard
            title="Most requested"
            definition="Number of bookings placed per tool, including bookings later cancelled."
            loading={loading}
            error={error}
            isEmpty={demandMetrics.length === 0}
            height={height}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandMetrics} margin={CHART_MARGIN}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    {/* Angled labels, because tool names are too long to sit flat. */}
                    <XAxis dataKey="toolName" {...AXIS} angle={-35} textAnchor="end" height={70} />
                    <YAxis allowDecimals={false} {...AXIS} />
                    <Tooltip cursor={BAR_CURSOR} />
                    <Bar dataKey="requestCount" name="Bookings" fill={CHART_COLOURS.blue} radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ManagementMetricCard>
    );
}

export default ManagementDemandCard;
