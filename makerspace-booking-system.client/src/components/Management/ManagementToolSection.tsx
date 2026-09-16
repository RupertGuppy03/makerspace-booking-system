/**
 * this file is for the manager dashboard. It will display the tool metrics and
 * trends for the makerspace for all tools: utilisation rate, damage incidents
 * per tool, and most requested tools.
 *
 * Figures arrive from /api/management/metrics. When a metric has no rows yet the
 * card shows a short message in place of the chart.
 */

import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import ManagementMetricCard from './ManagementMetricCard';
import { useOutletContext } from 'react-router-dom';
import type { DashboardMetricsState } from '../../pages/Management/useDashboardMetrics';

function ManagementToolSection() {
    /*
     * The figures are fetched once by ManagementPage, the frame this section
     * sits inside. useOutletContext reads what that frame passed down, so this
     * section does not fetch anything itself.
     */
    const { metrics, loading, error } = useOutletContext<DashboardMetricsState>();

    // Recharts needs arrays, never null, so fall back to empty ones.
    const utilisationMetrics = metrics?.toolMetrics.utilisationMetrics ?? [];
    const damageMetrics = metrics?.toolMetrics.damageMetrics ?? [];
    const demandMetrics = metrics?.toolMetrics.demandMetrics ?? [];

    return (
        <div>
            <section>
                <h2>Tool Metrics</h2>
                <p>How hard each tool is working, and what members actually want, across the last 12 months.</p>

                <div className="management-metric-grid">
                    <ManagementMetricCard
                        title="Tool utilisation rate"
                        definition="Days each tool was booked out, as a percentage of the days it was available in the period. Maintenance downtime currently counts as available time, which slightly understates the figure."
                        loading={loading}
                        error={error}
                        isEmpty={utilisationMetrics.length === 0}
                    >
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={utilisationMetrics} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" unit="%" />
                                <YAxis type="category" dataKey="toolName" width={140} />
                                <Tooltip />
                                <Bar dataKey="utilisationRate" fill="var(--accent)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>

                    <ManagementMetricCard
                        title="Damage incidents per tool"
                        definition="Number of damage incidents recorded against each tool in the period."
                        loading={loading}
                        error={error}
                        isEmpty={damageMetrics.length === 0}
                    >
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={damageMetrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="toolName" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="damageCount" fill="var(--accent)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>

                    <ManagementMetricCard
                        title="Most requested tools"
                        definition="Number of bookings made for each tool, ranked highest first. Cancelled bookings are included, because a cancellation still shows the tool was wanted."
                        loading={loading}
                        error={error}
                        isEmpty={demandMetrics.length === 0}
                    >
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={demandMetrics} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis type="category" dataKey="toolName" width={140} />
                                <Tooltip />
                                <Bar dataKey="requestCount" fill="var(--accent)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>
                </div>
            </section>
        </div>
    );
}

export default ManagementToolSection;
