/**
 * this file is for the manager dashboard. It will display borrower reliability
 * metrics: on-time return rate, average overdue duration, cancellation rate and
 * no-show rate.
 *
 * All four charts are fully configured but have no data yet. They depend on
 * columns that do not exist in the database (status, returned_at), so each one
 * renders empty with a placeholder over it.
 */

import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import ManagementMetricCard from './ManagementMetricCard';
import type { DashboardMetrics } from '../../types/metrics';

type Props = {
    metrics: DashboardMetrics | null;
    loading: boolean;
    error: string | null;
};

function ManagementUserSection({ metrics, loading, error }: Props) {

    // Empty lists until the schema is locked. Recharts needs arrays, never null.
    const onTimeReturnTrend = metrics?.userMetrics.onTimeReturnTrend ?? [];
    const averageOverdueTrend = metrics?.userMetrics.averageOverdueTrend ?? [];
    const cancellationTrend = metrics?.userMetrics.cancellationTrend ?? [];
    const noShowTrend = metrics?.userMetrics.noShowTrend ?? [];

    return (
        <div>
            <section>
                <h2>User Metrics</h2>
                <p>How reliably borrowers return what they book, across the last 12 months.</p>

                <div className="management-metric-grid">
                    <ManagementMetricCard
                        title="On-time return rate"
                        definition="Bookings returned on or before their due date, as a percentage of all bookings that have been returned. Bookings still out are excluded."
                        loading={loading}
                        error={error}
                        isEmpty={onTimeReturnTrend.length === 0}
                    >
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={onTimeReturnTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis unit="%" />
                                <Tooltip />
                                <Line type="monotone" dataKey="rate" stroke="var(--accent)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>

                    <ManagementMetricCard
                        title="Average overdue duration"
                        definition="Average number of days late, counting only bookings that were returned after their due date. On-time returns are excluded so the figure is not diluted toward zero."
                        loading={loading}
                        error={error}
                        isEmpty={averageOverdueTrend.length === 0}
                    >
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={averageOverdueTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis unit="d" />
                                <Tooltip />
                                <Bar dataKey="duration" fill="var(--accent)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>

                    <ManagementMetricCard
                        title="Cancellation rate"
                        definition="Bookings cancelled before collection, as a percentage of all bookings made. The borrower told us in advance."
                        loading={loading}
                        error={error}
                        isEmpty={cancellationTrend.length === 0}
                    >
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={cancellationTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis unit="%" />
                                <Tooltip />
                                <Line type="monotone" dataKey="rate" stroke="var(--accent)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>

                    <ManagementMetricCard
                        title="No-show rate"
                        definition="Bookings never collected and never cancelled, as a percentage of all bookings made. Tracked separately from cancellations because the borrower gave no warning."
                        loading={loading}
                        error={error}
                        isEmpty={noShowTrend.length === 0}
                    >
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={noShowTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis unit="%" />
                                <Tooltip />
                                <Line type="monotone" dataKey="rate" stroke="var(--accent)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>
                </div>
            </section>
        </div>
    );
}

export default ManagementUserSection;
