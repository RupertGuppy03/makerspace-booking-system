/**
 * Shown in place of a chart when there is nothing to draw — still loading, the
 * request failed, or the period genuinely has no records.
 *
 * The dashboard never invents numbers, so an empty metric says so plainly
 * rather than showing a chart of zeroes that could be mistaken for real.
 */

type Props = {
    message: string;
};

function ManagementChartPlaceholder({ message }: Props) {
    return (
        <div className="management-chart-placeholder">
            <p>{message}</p>
        </div>
    );
}

export default ManagementChartPlaceholder;
