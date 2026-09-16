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
                        <th>Id</th>
                        <th>status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Tool Name</th>
                        <th>Cancel</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.toSorted((a, b) => (a.startDay > b.startDay) ? -1 : ((a.startDay < b.startDay) ? 1 : 0)).map((reservation, idx) =>
                    //sorts the reservations by start date
                        <tr key={idx}>
                            <td>{reservation.id}</td>
                            <td>{reservation.status}</td>
                            <td>{reservation.startDay ? new Date(reservation.startDay).toDateString() : ''}</td>
                            <td>{reservation.endDay ? new Date(reservation.endDay).toDateString() : ''}</td>
                            <td>{reservation.tool ? reservation.tool.name : "no tool found"}</td>
                            <td><button type="button" onClick={() => handleCancelReservation(reservation.id)}> cancel </button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}