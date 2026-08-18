import { useState } from 'react';
import { useAuth } from '../../../lib/authProvider';
import AccountBanner from '../../../components/accountBanner';
import { useSearchParams } from 'react-router-dom';
import type { NewReservation } from '../../../types/newReservasion';


export default function Reserve() {

    const [searchParams] = useSearchParams();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const { user } = useAuth();

    const form =
        <form onSubmit={handleSubmitReservation}>
            {/*TODO import a react date picker library*/}
            <label>
                Start Date:
                <input type="date" defaultValue={Date.now()} onChange={e => { if (e.target.valueAsDate) setStartDate(e.target.valueAsDate) }}/>
            </label>
            <label>
                End Date:
                <input type="date" onChange={e => { if (e.target.valueAsDate) setEndDate(e.target.valueAsDate) }}/>
            </label>
            <button type="submit">Create Reservation</button>
        </form>


    return (
        <div>
            <AccountBanner />
            <h1 id="tableLabel">Reserve Tool</h1>
            <br />
            <div>
                {form}
            </div>
        </div>
    );



    async function handleSubmitReservation(e : React.SubmitEvent) {

        e.preventDefault();


        // Null input validation
        if (!user) {
            alert("Must be logged in to make a reservation");
            return;
        }
        const uuid = user.id;

        const toolIdStr = searchParams.get('toolId');
        if (!toolIdStr) {
            alert("Error: no tool is selected");
            return;
        }
        const toolId = parseInt(toolIdStr);


        //Create new reservation
        const reservation: NewReservation = {
            startDay: startDate,
            endDay: endDate,
            userId: uuid,
            toolId: toolId,
            status: "booked",
            amountCharged: 12
        };

        const response = await fetch("/api/reservation", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservation)
        });

        const data = await response.json()
        alert(`Reservation created: ${data}`);
    };
   
};