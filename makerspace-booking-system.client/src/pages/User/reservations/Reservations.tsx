import { useEffect, useState } from 'react';
import type { Reservation } from "../../../types/reservation";
import { useAuth } from '../../../lib/authProvider';
import ReservationTable from '../../../components/ReservationTable'
import AccessDenied from '../../AccessDenied/AccessDenied';

type Tab = 'current' | 'past' | 'all';

const TABS: { id: Tab; label: string }[] = [
    { id: 'current', label: 'Current' },
    { id: 'past', label: 'Past' },
    { id: 'all', label: 'All' },
];

export default function Reservations() {


    const [activeTab, setActiveTab] = useState<Tab>('current');
    const [reservations, setReservations] = useState<Reservation[]>();
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>();
    const { user, role } = useAuth();


    //Only allow access if logged in with user role or higher (deny if not logged in)
    if (role != 'user' && role != 'admin' && role != 'manager') {
        return <AccessDenied />;
    }
    

    useEffect(() => {
        populateReservationData();
    }, [user]); //TODO depending on user here causes a 2nd api call. should JWT in api fetch instead

    useEffect(() => {
        filterReservations();
    }, [activeTab, reservations])

    const table =
        <div>
            <nav className="management-tabs" role="tablist" aria-label="Reservation Table Tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={
                            activeTab === tab.id
                                ? 'management-tab management-tab--active'
                                : 'management-tab'
                        }
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
            <ReservationTable reservations={filteredReservations} handleCancelReservation={handleCancelReservation} />
        </div>


    return (
        <div>
            <h1 id="tableLabel">Your Reservations</h1>
            <p>This page shows all the reservations you have made and their status</p>
            <br />
            <div>
                {user === null
                    ? < p > <em>You must be logged in to see your reservations</em></p>
                    : table}

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

    async function filterReservations() {
        if (reservations === undefined) return;
        //const now = new Date()
        const filtered = reservations.filter(r => {
            //Option here to filter by date instead of status. Doesn't work because startDay is actually in yyyy-mm-ddThh:mm:dd date format
            // if (activeTab === 'current') return r.startDay >= now;
            // if (activeTab === 'past') return r.startDay < now;
            const status = r.status;
            if (activeTab === 'current') return status == "booked"
            if (activeTab === 'past') return status == "cancelled" || status == "returned" || status == "no_show"
            return true; // 'all'
        })
        setFilteredReservations(filtered)

    }

     async function handleCancelReservation(reservationId : number) {


             const response = await fetch(`/api/reservation/${reservationId}/cancel`, {
                 method: "Patch",
             });

             const data = await response.json()
             alert(`reservation cancelled: ${data}`);

     }
   
}

