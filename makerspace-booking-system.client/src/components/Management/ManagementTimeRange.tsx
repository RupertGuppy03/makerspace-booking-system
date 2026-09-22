/**
 * The small Week / Month switch in the corner of a chart card.
 *
 * Props:
 * - value: the range currently selected
 * - onChange: called with the new range when a button is clicked
 *
 * The API sends every trend both ways, so switching never fetches anything -
 * the section just reads the other list.
 */

export type TimeRange = 'week' | 'month';

type Props = {
    value: TimeRange;
    onChange: (range: TimeRange) => void;
};

const RANGES: { id: TimeRange; label: string }[] = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
];

function ManagementTimeRange({ value, onChange }: Props) {
    return (
        <div className="management-range">
            {RANGES.map((range) => (
                <button
                    key={range.id}
                    type="button"
                    className={value === range.id ? 'management-range--on' : undefined}
                    onClick={() => onChange(range.id)}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
}

export default ManagementTimeRange;
