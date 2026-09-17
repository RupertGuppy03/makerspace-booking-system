/**
 * The list of labelled bars that sits beside a doughnut chart, showing each
 * slice's share as a percentage.
 *
 * The doughnut shows the shape at a glance; this puts the actual numbers next
 * to it, which is what someone reading the dashboard usually wants.
 */

type Props = {
    items: { label: string; value: number; colour: string }[];
};

function ManagementRankedList({ items }: Props) {
    const total = items.reduce((sum, item) => sum + item.value, 0);

    // Guard against dividing by zero when every figure is still zero.
    const share = (value: number) => (total === 0 ? 0 : (value / total) * 100);

    return (
        <div>
            {items.map((item) => (
                <div key={item.label}>
                    <p className="management-rank-row">
                        <span>{item.label}</span>
                        <b>{share(item.value).toFixed(1)}%</b>
                    </p>
                    <div className="management-rank-bar">
                        <span style={{ width: `${share(item.value)}%`, background: item.colour }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ManagementRankedList;
