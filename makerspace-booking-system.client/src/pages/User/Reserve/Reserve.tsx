import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/authProvider';
import AccountBanner from '../../../components/accountBanner';
import { useSearchParams } from 'react-router-dom';
import type { NewReservation } from '../../../types/newReservasion';
import { DateRangePicker, type DateRange } from "rsuite";
import type { Reservation } from '../../../types/reservation';
import type { Tool } from '../../../types/tool';
import { useNavigate } from "react-router-dom";


export default function Reserve() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const [tool, setTool] = useState<Tool>();
    const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | null>();
    const { user } = useAuth();

    useEffect(() => {
        populateToolName();
        getExistingReservations();
    }, [])

    const form =
        <form onSubmit={handleSubmitReservation}>
            <label>
                Start and End Dates:
                <DateRangePicker value={dateRange} onChange={setDateRange}
                    shouldDisableDate={handleShouldDisableDate}
                />
            </label>
            <button type="submit">Create Reservation</button>
        </form>


    return (
        <div>
            <AccountBanner />
            <h1 id="tableLabel">Reserve Tool</h1>
            <h4>Making reservation for tool: {tool?.name ?? "Loading..."}</h4>
            <br />
            <div>
                {form}
            </div>
        </div>
    );

    async function populateToolName() {
        const toolId = searchParams.get('toolId')
        const response = await fetch(`/api/tools/${toolId}`);
        if (response.ok) {
            const data = await response.json();
            setTool(data);
        }
    }

    async function getExistingReservations() {
        const toolId = searchParams.get('toolId')
        const response = await fetch(`/api/tools/${toolId}/reservations`);
        if (response.ok) {
            const data = await response.json();
            setExistingReservations(data);
        }
    }

    function handleShouldDisableDate(date: Date) {
        //disable if date is today or in the past
        if (date < new Date()) return true;

        //disable if the date overlaps with any existing reservations
        if (existingReservations?.some(r => new Date(r.startDay) <= date && date <= new Date(r.endDay))) {
            return true
        }

        //otherwise, keep enabled
        return false;

    }


    async function handleSubmitReservation(e : React.SubmitEvent) {

        e.preventDefault();


        // Null input validation
        if (!user) {
            alert("Must be logged in to make a reservation");
            return;
        }
        const uuid = user.id;

        if (!dateRange) {
            alert("Please Select a start and end date for the reservation")
            return;
        }

        const toolIdStr = searchParams.get('toolId');
        if (!toolIdStr) {
            alert("Error: no tool is selected");
            return;
        }
        const toolId = parseInt(toolIdStr);


        //Create new reservation
        const reservation: NewReservation = {
            startDay: dateRange[0],
            endDay: dateRange[1],
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

        if (response.ok) {

            const data = await response.json()
            alert(`Reservation created: ${data}`);
            navigate("/user/reservations")
        } else {
            const errorData = await response.json();
            alert(`Error Creating reservation: ${errorData.detail}`);
        }
    };
   
};