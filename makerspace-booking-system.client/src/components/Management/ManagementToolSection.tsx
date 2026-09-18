/**
 * The Tool section of the manager dashboard: which tools are earning their
 * keep, which are booked out constantly, which are most in demand, and which
 * keep coming back damaged.
 *
 * Figures arrive from /api/management/metrics. Where a metric has no data yet
 * the card says so rather than drawing a chart of zeroes.
 */

import { useState } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useOutletContext } from 'react-router-dom';
import type { DashboardMetricsState } from '../../pages/Management/useDashboardMetrics';
import ManagementMetricCard from './ManagementMetricCard';
import ManagementStatCard from './ManagementStatCard';
import ManagementTimeRange from './ManagementTimeRange';
import type { TimeRange } from './ManagementTimeRange';
import ManagementRankedList from './ManagementRankedList';
import {
    CHART_COLOURS, CATEGORY_COLOURS, AXIS, CHART_MARGIN, BAR_CURSOR, utilisationColour,
    formatPercent, utilisationTooltip, moneyTooltip,
} from './managementChartTheme';

function ManagementToolSection() {
    /*
     * The figures are fetched once by ManagementPage, the frame this section
     * sits inside. useOutletContext reads what that frame passed down.
     */
    const { metrics, loading, error } = useOutletContext<DashboardMetricsState>();

    /*
     * Whether "Revenue by tool" covers the last 12 weeks or the last 12 months.
     * The API sends both, so switching just reads the other list.
     */
    const [range, setRange] = useState<TimeRange>('month');

    // Recharts needs arrays, never null, so fall back to empty ones.
    const utilisationMetrics = metrics?.toolMetrics.utilisationMetrics ?? [];
    const damageMetrics = metrics?.toolMetrics.damageMetrics ?? [];
    const demandMetrics = metrics?.toolMetrics.demandMetrics ?? [];
    // [range] picks either the .week or the .month list.
    const revenueByTool = metrics?.toolMetrics.revenueByTool[range] ?? [];

    /*
     * The doughnut gets hard to read with lots of slices, so we name the four
     * biggest earners and group the rest into "Other tools". The API already
     * sends them biggest first.
     */
    const topTools = revenueByTool.slice(0, 4);
    const otherToolsTotal = revenueByTool.slice(4).reduce((sum, tool) => sum + tool.amount, 0);

    const toolSlices = [
        ...topTools.map((tool, index) => ({
            label: tool.toolName,
            value: tool.amount,
            colour: CATEGORY_COLOURS[index],
        })),
        ...(otherToolsTotal > 0
            ? [{ label: 'Other tools', value: otherToolsTotal, colour: CHART_COLOURS.grey }]
            : []),
    ];

    // Headline figures, worked out from the lists above.
    const averageUtilisation =
        utilisationMetrics.length === 0
            ? 0
            : utilisationMetrics.reduce((sum, tool) => sum + tool.utilisationRate, 0) /
              utilisationMetrics.length;

    const totalDamage = damageMetrics.reduce((sum, tool) => sum + tool.damageCount, 0);

    const mostBooked = demandMetrics.reduce<typeof demandMetrics[number] | null>(
        (best, current) => (best === null || current.requestCount > best.requestCount ? current : best),
        null
    );

    // Biggest first, so the bars read as a ranking rather than a random order.
    const utilisationRanked = [...utilisationMetrics].sort(
        (a, b) => b.utilisationRate - a.utilisationRate
    );

    return (
        <div>
            {/* ---------- headline figures ---------- */}
            <div className="row g-4 mb-4">
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="blue"
                        label="Tools tracked"
                        value={metrics === null ? null : String(utilisationMetrics.length)}
                        note="Appearing in the last 12 months"
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="green"
                        label="Average utilisation"
                        value={metrics === null ? null : formatPercent(averageUtilisation)}
                        note="Share of days booked out"
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="amber"
                        label="Damage reports"
                        value={metrics === null ? null : String(totalDamage)}
                        note="Logged across all tools"
                    />
                </div>
                <div className="col-sm-6 col-xl-3">
                    <ManagementStatCard
                        colour="sky"
                        label="Most booked"
                        value={mostBooked === null ? null : mostBooked.toolName}
                        note={mostBooked === null ? 'No bookings yet' : `${mostBooked.requestCount} bookings`}
                    />
                </div>
            </div>

            {/* ---------- revenue split and utilisation ---------- */}
            <div className="row g-4 mb-4">
                <div className="col-lg-6">
                    <ManagementMetricCard
                        title="Revenue by tool"
                        definition={`Share of revenue earned by each tool over the last 12 ${range}s. Cancelled bookings are excluded, and tools that earned nothing are left out.`}
                        loading={loading}
                        error={error}
                        isEmpty={toolSlices.length === 0}
                        height={200}
                        action={<ManagementTimeRange value={range} onChange={setRange} />}
                    >
                        <div className="row align-items-center h-100">
                            <div className="col-sm-7 h-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={toolSlices}
                                            dataKey="value"
                                            nameKey="label"
                                            innerRadius="62%"
                                            outerRadius="100%"
                                            stroke="none"
                                        >
                                            {/* Cell colours each slice individually. */}
                                            {toolSlices.map((slice) => (
                                                <Cell key={slice.label} fill={slice.colour} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={moneyTooltip} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="col-sm-5">
                                {/* The percentage each tool earned, next to the doughnut. */}
                                <ManagementRankedList items={toolSlices} />
                            </div>
                        </div>
                    </ManagementMetricCard>
                </div>

                <div className="col-lg-6">
                    <ManagementMetricCard
                        title="Utilisation"
                        definition="Share of days in the period each tool was booked out. Red means booked more than 80% of the time, which suggests a second unit is worth buying. Green under 60% suggests one is sitting idle."
                        loading={loading}
                        error={error}
                        isEmpty={utilisationRanked.length === 0}
                        height={280}
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
                </div>
            </div>

            {/* ---------- demand and damage ---------- */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <ManagementMetricCard
                        title="Most requested"
                        definition="Number of bookings placed per tool, including bookings later cancelled."
                        loading={loading}
                        error={error}
                        isEmpty={demandMetrics.length === 0}
                        height={220}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demandMetrics} margin={CHART_MARGIN}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="toolName" {...AXIS} angle={-35} textAnchor="end" height={70} />
                                <YAxis allowDecimals={false} {...AXIS} />
                                <Tooltip cursor={BAR_CURSOR} />
                                <Bar
                                    dataKey="requestCount"
                                    name="Bookings"
                                    fill={CHART_COLOURS.blue}
                                    radius={4}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>
                </div>

                <div className="col-lg-6">
                    <ManagementMetricCard
                        title="Damage incidents"
                        definition="Logged damage reports per tool. A tool appearing repeatedly may need its induction reviewed."
                        loading={loading}
                        error={error}
                        isEmpty={damageMetrics.length === 0}
                        height={220}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={damageMetrics} margin={CHART_MARGIN}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="toolName" {...AXIS} angle={-35} textAnchor="end" height={70} />
                                <YAxis allowDecimals={false} {...AXIS} />
                                <Tooltip cursor={BAR_CURSOR} />
                                <Bar
                                    dataKey="damageCount"
                                    name="Incidents"
                                    fill={CHART_COLOURS.rose}
                                    radius={4}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ManagementMetricCard>
                </div>
            </div>
        </div>
    );
}

export default ManagementToolSection;
