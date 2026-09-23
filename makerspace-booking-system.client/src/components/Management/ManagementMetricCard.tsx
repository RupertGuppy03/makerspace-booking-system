/**
 * The white card a chart sits in: a title, an optional control in the header,
 * the chart itself, and a short note underneath explaining what it means.
 *
 * The chart is passed as children rather than as a prop so each metric can use
 * whatever chart type suits it. When there is nothing to show, a short message
 * replaces the chart rather than leaving an empty set of axes.
 */

import type { ReactNode } from 'react';
import ManagementChartPlaceholder from './ManagementChartPlaceholder';
import './ManagementDashboard.css';

type Props = {
    title: string;
    definition: string;
    loading: boolean;
    error: string | null;
    isEmpty: boolean;
    // How tall the chart area should be, in pixels.
    height?: number;
    // Anything to show on the right of the header, such as a time range switch.
    action?: ReactNode;
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

function ManagementMetricCard({
    title, definition, loading, error, isEmpty, height = 240, action, children,
}: Props) {
    const message = placeholderMessage(loading, error, isEmpty);

    return (
        <article className="management-card">
            <div className="management-card-head">
                <h3 className="management-card-title">{title}</h3>
                {action}
            </div>

            <div className="management-card-body">
                {/* Fixed height so the card does not resize when the chart is
                    swapped for the "nothing to show" message. */}
                <div style={{ height }}>
                    {message === null ? children : <ManagementChartPlaceholder message={message} />}
                </div>

                <p className="management-card-note">{definition}</p>
            </div>
        </article>
    );
}

export default ManagementMetricCard;
