/**
 * "Utilisation" - the share of days in the period each tool was booked out,
 * drawn as bars running left to right.
 *
 * This is the one chart where the colour carries meaning rather than
 * decoration, which is why each bar is coloured on its own.
 *
 * Shared by the manager dashboard and the admin dashboard. Hand it the figures
 * and it draws itself; it does no fetching of its own.
 */

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardMetrics } from '../../types/metrics';
import ManagementMetricCard from './ManagementMetricCard';
import { AXIS, CHART_MARGIN, BAR_CURSOR, utilisationColour, utilisationTooltip } from './managementChartTheme';

type Props = {
    metrics: DashboardMetrics | null;
    loading: boolean;
    error: string | null;
    height?: number;
};

function ManagementUtilisationCard({ metrics, loading, error, height = 280 }: Props) {
    const utilisationMetrics = metrics?.toolMetrics.utilisationMetrics ?? [];

    // Biggest first, so the bars read as a ranking rather than a random order.
    // [...list] copies it first, because sort() would otherwise reorder the
    // original array that the rest of the page is also reading.
    const utilisationRanked = [...utilisationMetrics].sort(
        (a, b) => b.utilisationRate - a.utilisationRate
    );

    return (
        <ManagementMetricCard
            title="Utilisation"
            definition="Share of days in the period each tool was booked out. Red means booked more than 80% of the time, which suggests a second unit is worth buying. Green under 60% suggests one is sitting idle."
            loading={loading}
            error={error}
            isEmpty={utilisationRanked.length === 0}
            height={height}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={utilisationRanked} margin={CHART_MARGIN}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} unit="%" {...AXIS} />
                    <YAxis type="category" dataKey="toolName" width={130} {...AXIS} />
                    <Tooltip cursor={BAR_CURSOR} formatter={utilisationTooltip} />
                    <Bar dataKey="utilisationRate" name="Utilisation" radius={4} barSize={20}>
                        {/*
                          * Cell colours each bar on its own, so the colour can
                          * carry the warning rather than just decorate.
                          */}
                        {utilisationRanked.map((tool) => (
                            <Cell key={tool.toolId} fill={utilisationColour(tool.utilisationRate)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ManagementMetricCard>
    );
}

export default ManagementUtilisationCard;
