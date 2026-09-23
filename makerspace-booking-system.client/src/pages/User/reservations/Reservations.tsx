import { useEffect, useState } from 'react';
import type { Reservation } from "../../../types/reservation";
import { useAuth } from '../../../lib/authProvider';
import ReservationTable from '../../../components/ReservationTable'
import AccessDenied from '../../AccessDenied/AccessDenied';

type Tab = 'upcoming' | 'current' | 'past' | 'all';

const TABS: { id: Tab; label: string }[] = [
    { id: 'upcoming', label: 'Upcoming' },
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

            const reservationList = data.map((reservation: Reservation) => ({ //Convert Date type properties from string to Date, as Typescript does not auto convert it.
                ...reservation,
                startDay: new Date(reservation.startDay),
                endDay: new Date(reservation.endDay),
                collectedAt: reservation.collectedAt ? new Date(reservation.collectedAt) : null,
                returnedAt: reservation.returnedAt ? new Date(reservation.returnedAt) : null,
                cancelledAt: reservation.cancelledAt ? new Date(reservation.cancelledAt) : null,
            }));
            setReservations(reservationList);
        }

    }

    async function filterReservations() {
        if (reservations === undefined) return;
        const today = new Date();
        today.setHours(0, 0, 0, 0); //create date without a time-of-day so >= and > operators work correctly on the date 

        const filtered = reservations.filter(r => {
            if (activeTab === 'upcoming') return r.startDay > today && r.status != 'cancelled'; // 'upcoming' if it hasnt started yet
            if (activeTab === 'current') return r.startDay <= today && r.endDay >= today && r.status != 'cancelled'; // 'current' if it has started but not past the end day yet
            if (activeTab === 'past') return r.endDay < today || r.status == 'cancelled'; // 'past' if the end day has passed
            return true; // activeTab === 'all'
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

