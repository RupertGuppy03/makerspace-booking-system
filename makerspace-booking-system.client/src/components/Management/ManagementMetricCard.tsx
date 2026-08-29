/**
 * The frame each metric sits in: a title, the chart, and a definition.
 *
 * The chart is passed as children rather than as a prop so each metric can use
 * whatever chart type suits it. A placeholder covers the chart only when there
 * is genuinely nothing to show.
 */

import type { ReactNode } from 'react';
import ManagementChartPlaceholder from './ManagementChartPlaceholder';

type Props = {
    title: string;
    definition: string;
    loading: boolean;
    error: string | null;
    isEmpty: boolean;
    children: ReactNode;
};

// Works out what to say instead of the chart, or null to show the chart.
function placeholderMessage(
    loading: boolean,
    error: string | null,
    isEmpty: boolean
): string | null {
    if (loading) return 'Loading the latest figures...';
    if (error) return `Could not load this chart. ${error}`;
    if (isEmpty) return 'Nothing recorded for this period yet.';
    return null;
}

function ManagementMetricCard({ title, definition, loading, error, isEmpty, children }: Props) {
    const message = placeholderMessage(loading, error, isEmpty);

    return (
        <article className="management-metric-card">
            <h3 className="management-metric-title">{title}</h3>

            <div className="management-metric-chart">
                {message === null ? children : <ManagementChartPlaceholder message={message} />}
            </div>

            <p className="management-metric-definition">{definition}</p>
        </article>
    );
}

export default ManagementMetricCard;
