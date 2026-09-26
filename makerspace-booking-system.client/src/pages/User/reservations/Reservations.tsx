import { useEffect, useState } from 'react';
import type { Reservation } from "../../../types/reservation";
import { useAuth } from '../../../lib/authProvider';
import ReservationTable from '../../../components/ReservationTable'
import AccessDenied from '../../AccessDenied/AccessDenied';
import UserSidebar from '../../../components/User/UserSidebar';

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
            {/* The Upcoming / Current / Past / All tabs. The blue one is the
                tab that is currently selected. */}
            <nav className="user-tabs" role="tablist" aria-label="Reservation Table Tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={
                            activeTab === tab.id
                                ? 'user-tab user-tab--active'
                                : 'user-tab'
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
        /*
         * The same frame as User Tool View: the dark rail on the left, the
         * pale area on the right. Everything in user.css only works inside
         * .user-shell, so this outer div must stay.
         */
        <div className="user-shell">
            <UserSidebar activeId="reservations" />

            <div className="user-main">
                <header>
                    <h1 id="tableLabel" className="user-title">My reservations</h1>
                    <p className="user-breadcrumb">
                        Home / <span>My reservations</span>
                    </p>
                </header>

                <main>
                    <p className="user-lede">Every reservation you have made, and where it is up to.</p>
                    {user === null
                        ? <p className="user-info-note">You must be logged in to see your reservations.</p>
                        : table}
                </main>
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
            if (activeTab === 'upcoming') return r.status == "booked"; // 'upcoming' if it hasnt started yet
            if (activeTab === 'current') return r.status == "ready" || r.status == "collected" || r.status == "overdue"; // 'current' if it is ready to be interacted with
            if (activeTab === 'past') return r.status == "cancelled" || r.status == "no_show" || r.status == "returned"; // 'past' if it is no longer interactable
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

