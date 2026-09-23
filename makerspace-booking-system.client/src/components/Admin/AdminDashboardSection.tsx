/**
 * The admin dashboard: an overview of the makerspace as it stands today, plus
 * the operational figures borrowed from the manager dashboard.
 *
 * Revenue is deliberately left out - that is a manager-only concern.
 *
 * Every chart below is the same component the manager dashboard renders, so
 * the two pages can never drift apart. This section only fetches the figures
 * and decides where they sit.
 */

import { useState } from 'react';
import { useAdminTools } from '../../pages/Admin/useAdminTools';
import { useDashboardMetrics } from '../../pages/Management/useDashboardMetrics';
import { isOverdue } from './adminToolUtils';

import ManagementStatCard from '../Management/ManagementStatCard';
import ManagementFailedBookingsCard from '../Management/ManagementFailedBookingsCard';
import ManagementOnTimeReturnCard from '../Management/ManagementOnTimeReturnCard';
import ManagementUtilisationCard from '../Management/ManagementUtilisationCard';
import ManagementDemandCard from '../Management/ManagementDemandCard';
import ManagementDamageCard from '../Management/ManagementDamageCard';
import type { TimeRange } from '../Management/ManagementTimeRange';

function AdminDashboardSection() {
    /*
     * Two separate trips to the server, because the figures come from two
     * different places. The tool list gives the three counts across the top;
     * the metrics endpoint gives the damage count and every chart.
     *
     * They are renamed as they come out so the two "loading" flags do not
     * collide.
     */
    const { tools, loading: toolsLoading } = useAdminTools();
    const { metrics, loading: metricsLoading, error: metricsError } = useDashboardMetrics();

    /*
     * Whether the two charts with a Week / Month switch show weeks or months.
     * Both share this one value, so clicking either switch moves both.
     */
    const [range, setRange] = useState<TimeRange>('month');

    const toolList = tools ?? [];
    const totalTools = toolList.length;
    const takenOut = toolList.filter((t) => t.isTakenOut).length;
    const overdue = toolList.filter(isOverdue).length;

    // Every damage report across every tool, added together.
    const totalDamage =
        metrics?.toolMetrics.damageMetrics.reduce((sum, tool) => sum + tool.damageCount, 0) ?? 0;

    return (
        <div>
            {/* ---------- headline figures ---------- */}
            <div className="row g-4 mb-4">
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="blue"
                        label="Total tools"
                        /* null makes the card show a dash rather than a made-up
                           number while the list is still on its way. */
                        value={toolsLoading ? null : String(totalTools)}
                        note="In the makerspace right now"
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="green"
                        label="Currently taken out"
                        value={toolsLoading ? null : String(takenOut)}
                        note="Booked out today"
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="amber"
                        label="Overdue for maintenance"
                        value={toolsLoading ? null : String(overdue)}
                        note="Past their maintenance period"
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="sky"
                        label="Damage reports"
                        value={metrics === null ? null : String(totalDamage)}
                        note="Logged across all tools"
                    />
                </div>
            </div>

            {/* ---------- bookings that fell through ---------- */}
            <div className="mb-4">
                <ManagementFailedBookingsCard
                    metrics={metrics}
                    loading={metricsLoading}
                    error={metricsError}
                    range={range}
                    onRangeChange={setRange}
                    height={280}
                />
            </div>

            {/* ---------- how borrowers behave, how hard tools work ---------- */}
            <div className="row g-4 mb-4">
                <div className="col-lg-6">
                    <ManagementOnTimeReturnCard
                        metrics={metrics}
                        loading={metricsLoading}
                        error={metricsError}
                        range={range}
                        onRangeChange={setRange}
                        height={280}
                    />
                </div>
                <div className="col-lg-6">
                    <ManagementUtilisationCard
                        metrics={metrics}
                        loading={metricsLoading}
                        error={metricsError}
                        height={280}
                    />
                </div>
            </div>

            {/* ---------- demand and damage ---------- */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <ManagementDemandCard
                        metrics={metrics}
                        loading={metricsLoading}
                        error={metricsError}
                        height={220}
                    />
                </div>
                <div className="col-lg-6">
                    <ManagementDamageCard
                        metrics={metrics}
                        loading={metricsLoading}
                        error={metricsError}
                        height={220}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardSection;
