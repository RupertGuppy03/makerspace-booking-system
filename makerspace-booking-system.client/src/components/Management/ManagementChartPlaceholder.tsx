/**
 * 
 * the message shown here is where the data would be displayed, but the data is not being fetched from the backend yet.
 * 
 * 
 */


type Props = {
    message?: string;
};

function ManagementChartPlaceholder({message}: Props) {
    return (
        <div className="management-chart-placeholder">
            <p>{message ?? 'Will render once the database schema is locked.'}</p>
        </div>
    );
}

export default ManagementChartPlaceholder;