/**
 * this file is for the manager dashboard. It will display the tool metrics and
 * trends for the makerspace for all tools: utilisation rate, damage incidents
 * per tool, and most requested tools.
 *
 * All three charts are fully configured but have no data yet. Utilisation and
 * demand need columns that do not exist; damage needs an entire DamageIncidents
 * table, which has not been created at all.
 */

import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import ManagementMetricCard from './ManagementMetricCard';
import { useDashboardMetrics } from '../../pages/Management/useDashboardMetrics';

function ManagementToolSection() {
    const { metrics } = useDashboardMetrics();

    // Empty lists until the schema is locked. Recharts needs arrays, never null.
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
                        placeholderMessage="Requires a DamageIncidents table, which does not exist in the database yet."
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
