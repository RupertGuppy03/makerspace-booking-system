/**
 * One of the solid-coloured headline figures across the top of each section.
 *
 * Shows a label, a large value and a short factual note. If a trend is passed
 * in it draws a small line in the corner of the card. When the figure is not
 * available yet, pass value as null and the card shows a dash rather than a
 * made-up number.
 */

import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './ManagementDashboard.css';

type Props = {
    label: string;
    value: string | null;
    note: string;
    colour: 'blue' | 'green' | 'amber' | 'sky';
    trend?: number[];
};

function ManagementStatCard({ label, value, note, colour, trend }: Props) {
    // Recharts wants a list of objects, so turn the plain numbers into that shape.
    const trendData = (trend ?? []).map((n, index) => ({ index, value: n }));

    return (
        <div className={`management-stat management-stat--${colour}`}>
            <div className="management-stat-label">{label}</div>
            <div className="management-stat-value">{value ?? '—'}</div>

            <p className="management-stat-note">{note}</p>

            {/* Sits below the note across the full width of the card. */}
            {trendData.length > 1 && (
                <div className="management-stat-spark">
                    <ResponsiveContainer width="100%" height="100%">
                        {/* The margin stops the line being clipped at the top and bottom. */}
                        <LineChart data={trendData} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="rgba(255,255,255,0.95)"
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default ManagementStatCard;
