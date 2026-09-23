/**
 * "Damage incidents" - how many damage reports each tool has collected.
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

function ManagementDamageCard({ metrics, loading, error, height = 220 }: Props) {
    const damageMetrics = metrics?.toolMetrics.damageMetrics ?? [];

    return (
        <ManagementMetricCard
            title="Damage incidents"
            definition="Logged damage reports per tool. A tool appearing repeatedly may need its induction reviewed."
            loading={loading}
            error={error}
            isEmpty={damageMetrics.length === 0}
            height={height}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={damageMetrics} margin={CHART_MARGIN}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    {/* Angled labels, because tool names are too long to sit flat. */}
                    <XAxis dataKey="toolName" {...AXIS} angle={-35} textAnchor="end" height={70} />
                    <YAxis allowDecimals={false} {...AXIS} />
                    <Tooltip cursor={BAR_CURSOR} />
                    <Bar dataKey="damageCount" name="Incidents" fill={CHART_COLOURS.rose} radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ManagementMetricCard>
    );
}

export default ManagementDamageCard;
