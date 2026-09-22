import type { Reservation } from "../types/reservation";


interface ToolTableProps {
    reservations: Reservation[] | undefined,
    handleCancelReservation: (id: number) => void
}
export default function ReservationTable({ reservations=undefined, handleCancelReservation }: ToolTableProps) {

    if (reservations === undefined) {
        return (
            <p><em>Loading reservations...</em></p>
        )
    }
    if (reservations.length == 0) {
        return (
            <p><em>There are no reservations here</em></p>
        )
    }
    return (
        <div>
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Tool</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Amount Charged</th>
                        <th>Cancel</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.toSorted((a, b) => (a.startDay > b.startDay) ? -1 : ((a.startDay < b.startDay) ? 1 : 0)).map((reservation, idx) =>
                        //sorts the reservations by start date
                        <tr key={idx}>
                            <td>{reservation.tool ? reservation.tool.name : "no tool found"}</td>
                            <td>{reservation.status}</td>
                            <td>{reservation.startDay ? new Date(reservation.startDay).toDateString() : ''}</td>
                            <td>{reservation.endDay ? new Date(reservation.endDay).toDateString() : ''}</td>
                            <td>${reservation.amountCharged}</td>
                            {(reservation.status == "booked" || reservation.status == "ready") // only allow cancelling if it has not yet been collected, finished/returned, cancelled, or missed/no show
                                ? <td><button type="button" onClick={() => handleCancelReservation(reservation.id)}> Cancel </button></td>
                                : <td><button type="button" disabled onClick={() => handleCancelReservation(reservation.id)} style={{ color: "grey" }} > Cancel </button></td>
                            }
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}