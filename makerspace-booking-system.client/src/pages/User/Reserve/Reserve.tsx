import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/authProvider';
import { useSearchParams } from 'react-router-dom';
import type { NewReservation } from '../../../types/newReservasion';
import { DateRangePicker, type DateRange } from "rsuite";
import type { Reservation } from '../../../types/reservation';
import type { Tool } from '../../../types/tool';
import { useNavigate } from "react-router-dom";
import AccessDenied from '../../AccessDenied/AccessDenied';


export default function Reserve() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState<boolean>(true)
    const [tool, setTool] = useState<Tool>();
    const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | null>();
    const { user, role } = useAuth();

    //Only allow access if logged in with user role or higher (deny if not logged in)
    if (role != 'user' && role != 'admin' && role != 'manager') {
        return <AccessDenied />;
    }

    useEffect(() => {
        populateToolName();
        getExistingReservations();
        setLoading(false);
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
            <h1 id="tableLabel">Reserve Tool</h1>
            {loading
                ? <h4>Loading tool name...</h4>
                : <h4>Create a reservation for tool: {tool?.name ?? "No tool found"}</h4>
            }
            <p>Reservations may be at most 5 days long.</p>
            <p>Reservations may not overlap with any existing reservations.</p>
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
        date = new Date(date) //Quick fix to change the time zone from DateRange picker to the correct one (from +13 to +12)

        //disable if date is today or in the past
        if (date < new Date()) return true;
        new Date()
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
            alert(`${errorData.detail}`);
        }
    };
   
};