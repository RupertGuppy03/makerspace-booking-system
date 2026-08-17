import { useEffect, useState } from 'react';
import { supabase } from "../../../lib/supabaseClient"
import type { Tool } from "../../../types/tool";
import type { Reservation } from "../../../types/reservation";
import { useAuth } from '../../../lib/authProvider';
import type { NewReservation } from '../../../types/newReservasion';
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
                    <th>Collected At</th>
                    <th>Tool Name</th>
                    <th>Cancel</th>
                </tr>
            </thead>
            <tbody>
                {reservations.map((reservation, idx) =>
                    <tr key={idx}>
                        <td>{reservation.id}</td>
                        <td>{reservation.status}</td>
                        <td>{reservation.collectedAt ? new Date(reservation.collectedAt).toDateString() : ''}</td>
                        <td>{reservation.tool ? reservation.tool.name : "no tool found"}</td>
                        <td><button type="button" onClick={() => handleCancelReservation(reservation.id) }> cancel </button></td>
                    </tr>
                )}
            </tbody>
        </table>


    return (
        <div>
            <AccountBanner />
            <h1 id="tableLabel">User Tool View</h1>
            <p>This page shows all tools from the database and allows you to reverse one if logged in</p>
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

     async function handleCancelReservation(toolId : number) {
    //     if (!user) {
    //         alert("Must be logged in to reserve a tool");
    //         return;
    //     }
    //     alert("Reserve Pressed")

    //     const endDate: Date = new Date();
    //     endDate.setDate(endDate.getDate() + 1);

    //     const reservation: NewReservation = {
    //         startDay: new Date(),
    //         endDay: endDate,
    //         toolId: toolId,
    //         userId: user.id
    //     };

    //     const response = await fetch("/api/reservation", {
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(reservation)
    //     });

    //     const data = await response.json()
    //     alert(`reservation created: ${data}`);
    //     return data; //TODO does this return to anywhere ?

     }
   
}

