import type { Reservation } from "../types/reservation";

/*
 * The colour each booking status is shown in. Statuses arrive from the
 * database as lower-case words like "no_show", so this also decides how they
 * are spelled on screen. The same colours as the admin reservations table.
 */
const STATUS_STYLES: Record<string, { label: string; colour: string }> = {
    booked: { label: 'Booked', colour: 'blue' },
    ready: { label: 'Ready for Pickup', colour: 'green' },
    collected: { label: 'Collected', colour: 'amber' },
    returned: { label: 'Returned', colour: 'grey' },
    cancelled: { label: 'Cancelled', colour: 'grey' },
    no_show: { label: 'No Show', colour: 'grey' },
    overdue: { label: 'Overdue', colour: 'rose' }
};

interface ToolTableProps {
    reservations: Reservation[] | undefined,
    handleCancelReservation: (id: number) => void
}

/*
 * The table on My reservations: one row per booking, newest first, with a
 * Cancel button on each. Takes the reservations to show (undefined while they
 * are still loading) and the function to call when Cancel is clicked.
 */
export default function ReservationTable({ reservations=undefined, handleCancelReservation }: ToolTableProps) {

    // The heading row, shared by the loading, empty and filled versions of the table.
    const head =
        <thead>
            <tr>
                <th>Tool</th>
                <th>Status</th>
                <th>Start date</th>
                <th>End date</th>
                <th className="user-num">Amount charged</th>
                {/* The Cancel button's column. No heading to give it. */}
                <th></th>
            </tr>
        </thead>

    if (reservations === undefined) {
        return (
            <div className="user-table-card">
                <table className="user-table" aria-labelledby="tableLabel">
                    {head}
                    <tbody>
                        <tr><td colSpan={6} className="user-table-empty">Loading reservations...</td></tr>
                    </tbody>
                </table>
            </div>
        )
    }
    if (reservations.length == 0) {
        return (
            <div className="user-table-card">
                <table className="user-table" aria-labelledby="tableLabel">
                    {head}
                    <tbody>
                        <tr><td colSpan={6} className="user-table-empty">There are no reservations here.</td></tr>
                    </tbody>
                </table>
            </div>
        )
    }
    return (
        <div className="user-table-card">
            <table className="user-table" aria-labelledby="tableLabel">
                {head}
                <tbody>
                    {reservations.toSorted((a, b) => (a.startDay > b.startDay) ? -1 : ((a.startDay < b.startDay) ? 1 : 0)).map((reservation, idx) => {
                        //sorts the reservations by start date

                        /* An unrecognised status still gets a label, just a
                           grey one with the raw word in it. */
                        const status = STATUS_STYLES[reservation.status] ?? { label: reservation.status, colour: 'grey' };

                        return (
                            <tr key={idx}>
                                <td>{reservation.tool ? reservation.tool.name : "no tool found"}</td>
                                <td>
                                    <span className={`user-pill user-pill--${status.colour}`}>{status.label}</span>
                                </td>
                                <td>{reservation.startDay ? new Date(reservation.startDay).toDateString() : ''}</td>
                                <td>{reservation.endDay ? new Date(reservation.endDay).toDateString() : ''}</td>
                                <td className="user-num">${reservation.amountCharged}</td>
                                {(reservation.status == "booked" || reservation.status == "ready") // only allow cancelling if it has not yet been collected, finished/returned, cancelled, or missed/no show
                                    ? <td className="user-num"><button type="button" className="user-btn user-btn--danger" onClick={() => handleCancelReservation(reservation.id)}>Cancel</button></td>
                                    : <td className="user-num"><button type="button" className="user-btn user-btn--danger" disabled onClick={() => handleCancelReservation(reservation.id)}>Cancel</button></td>
                                }
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

}
