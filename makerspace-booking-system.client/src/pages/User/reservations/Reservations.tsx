import { useEffect, useState } from 'react';
import type { Reservation } from "../../../types/reservation";
import { useAuth } from '../../../lib/authProvider';
import AccountBanner from '../../../components/accountBanner'


export default function Reservations() {


    const [reservations, setReservations] = useState<Reservation[]>();
    const { user } = useAuth();
    

    useEffect(() => {
        populateReservationData();
    }, [user]); //TODO depending on user here causes a 2nd api call. should JWT in api fetch instead

    const table = reservations === undefined
        ? <p><em>Must be logged in to see your reservations</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
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
                {reservations.map((reservation, idx) =>
                    <tr key={idx}>
                        <td>{reservation.id}</td>
                        <td>{reservation.status}</td>
                        <td>{reservation.startDay ? new Date(reservation.startDay).toDateString() : ''}</td>
                        <td>{reservation.endDay ? new Date(reservation.endDay).toDateString() : ''}</td>
                        <td>{reservation.tool ? reservation.tool.name : "no tool found"}</td>
                        <td><button type="button" onClick={() => handleCancelReservation(reservation.id) }> cancel </button></td>
                    </tr>
                )}
            </tbody>
        </table>


    return (
        <div>
            <AccountBanner />
            <h1 id="tableLabel">Your Reservations</h1>
            <p>This page shows all the reservations you have made and their status</p>
            <br />
            <div>
                {table}

            </div>
        </div>
    );



    async function populateReservationData() {

        //TODO should pass JWT session token to have server validate user, instead of extracting the user id here.
        const userId = user?.id;
        const response = await fetch(`/api/user/${userId}/reservations`);
        if (response.ok) {
            const data = await response.json();
            setReservations(data);
        }
    }

     async function handleCancelReservation(reservationId : number) {


             const response = await fetch(`/api/reservation/${reservationId}/cancel`, {
                 method: "Patch",
             });

             const data = await response.json()
             alert(`reservation cancelled: ${data}`);

     }
   
}

