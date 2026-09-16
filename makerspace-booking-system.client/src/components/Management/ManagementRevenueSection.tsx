/**
 * this is for the revenue tab of the manager dashboard. It will display the
 * revenue metrics and trends for the makerspace.
 *
 * The chart is fully configured but has no data yet — the amount_charged column
 * does not exist in the database, so it renders empty with a placeholder over it.
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ManagementMetricCard from './ManagementMetricCard';
import type { DashboardMetrics } from '../../types/metrics';

type Props = {
    metrics: DashboardMetrics | null;
    loading: boolean;
    error: string | null;
};

function ManagementRevenueSection({ metrics, loading, error }: Props) {

    // Empty list until the schema is locked. Recharts needs an array, never null.
    const monthlyRevenue = metrics?.revenueMetrics.monthlyRevenue ?? [];

    return (
        <div>
            <section>
                <h2>Revenue Metrics</h2>
                <p>Money taken from bookings across the last 12 months.</p>

                <div className="management-metric-grid">
                    <ManagementMetricCard
                        title="Revenue over time"
                        definition="Sum of amount_charged for all bookings, grouped by the month the booking starts. Cancelled bookings are excluded."
                        loading={loading}
                        error={error}
                        isEmpty={monthlyRevenue.length === 0}
                    >
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="var(--accent)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>
                </div>
            </section>
        </div>
    );
}

export default ManagementRevenueSection;
