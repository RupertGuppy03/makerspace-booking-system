/**
 * The small Week / Month / Year switch in the corner of a chart card.
 *
 * Only the ranges the API can actually supply are clickable. The rest are
 * shown but disabled, with a tooltip explaining why, so the control is already
 * in place when the backend can feed it.
 */

export type TimeRange = 'week' | 'month' | 'year';

type Props = {
    value: TimeRange;
    onChange: (range: TimeRange) => void;
    // Ranges the caller can actually show data for.
    available: TimeRange[];
};

const RANGES: { id: TimeRange; label: string }[] = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
];

function ManagementTimeRange({ value, onChange, available }: Props) {
    return (
        <div className="management-range">
            {RANGES.map((range) => {
                const enabled = available.includes(range.id);

                return (
                    <button
                        key={range.id}
                        type="button"
                        disabled={!enabled}
                        title={enabled ? undefined : 'The dashboard API does not supply this range yet'}
                        className={
                            value === range.id
                                ? 'management-range--on'
                                : undefined
                        }
                        onClick={() => onChange(range.id)}
                    >
                        {range.label}
                    </button>
                );
            })}
        </div>
    );
}

export default ManagementTimeRange;
