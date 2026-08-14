/**
 * 
 * this is the frame on the dashbaprd each metric will sit in, it will display the metric name, the value and a graph of the trend
 * 
 * the cahrt is passed as childern rather than as a prop so that the chart can be any type of chart and can be customized for each metric
 */

import type { ReactNode } from 'react';
import ManagementChartPlaceholder from './ManagementChartPlaceholder';

type Props = {
    title: string;
    definition: string;
    placeholderMessage?: string;
    children: ReactNode;
}

function ManagementMetricCard({ title, definition, placeholderMessage, children }: Props) {
    return (
        <article className="management-metric-card">
            <h3 className="management-metric-title">{title}</h3>
            
            <div className="management-metric-chart">
                {children}
                <ManagementChartPlaceholder message={placeholderMessage} />
            </div>
            <p className="management-metric-definition">{definition}</p>
        </article>
    );
}

export default ManagementMetricCard;