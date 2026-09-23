/**
 * The home page at "/".
 *
 * A menu of the other pages in the app. Takes no props — each tile just sends
 * you somewhere when it is clicked.
 */

import './App.css';
import { useNavigate } from "react-router-dom";
import RoleGate from './components/RoleGate';



function App() {
    const navigate = useNavigate();

    return (
        // The black full-height page. The card is centred inside it.
        <div className="home-shell">
            <div className="home-card">

                {/* The same blue mark the login page and the dashboard use. */}
                <div className="home-brand">
                    <span className="home-mark">M</span>
                    <span className="home-brand-name">Makerspace</span>
                </div>

                <h1 className="home-title">Available Pages</h1>
                <p className="home-sub">Choose where you want to go.</p>

                {/* Two tiles across on a laptop, one on a phone. */}
                <div className="home-grid">

                    <button
                        className="home-link"
                        onClick={() => navigate("user")}
                    >
                        {/*
                          * aria-hidden hides the drawing from screen readers.
                          * The words next to it already say where the tile goes,
                          * so reading the picture out too would just be noise.
                          */}
                        <span className="home-link-icon">
                            <svg viewBox="0 0 16 16" aria-hidden="true">
                                <path d="M11 1a4 4 0 0 0-3.6 5.7L1.6 12.5a1.4 1.4 0 0 0 2 2l5.8-5.8A4 4 0 1 0 11 1Z" />
                            </svg>
                        </span>
                        <span>
                            <span className="home-link-name">User Tool View</span>
                            <span className="home-link-desc">Browse tools and reserve one</span>
                        </span>
                    </button>
                    <RoleGate requiredRole='user'>
                    <button
                        className="home-link"
                        onClick={() => navigate("user/reservations")}
                    >
                        <span className="home-link-icon">
                            <svg viewBox="0 0 16 16" aria-hidden="true">
                                <path d="M5 1v1.5h6V1h1.5v1.5H14a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1.5V1H5Zm8.5 5h-11v8h11V6Z" />
                            </svg>
                        </span>
                        <span>
                            <span className="home-link-name">Your Reservations</span>
                            <span className="home-link-desc">See and cancel your bookings</span>
                        </span>
                    </button>
                    </RoleGate>
                    <RoleGate requiredRole='admin'>
                    <button
                        className="home-link"
                        onClick={() => navigate("admin")}
                    >
                        <span className="home-link-icon">
                            <svg viewBox="0 0 16 16" aria-hidden="true">
                                <path d="M2 2h5v5H2V2Zm7 0h5v5H9V2ZM2 9h5v5H2V9Zm7 0h5v5H9V9Z" />
                            </svg>
                        </span>
                        <span>
                            <span className="home-link-name">Admin</span>
                            <span className="home-link-desc">Manage inventory and maintenance</span>
                        </span>
                    </button>
                    </RoleGate>
                    <RoleGate requiredRole='manager'>
                    <button
                        className="home-link"
                        onClick={() => navigate("management")}
                    >
                        <span className="home-link-icon">
                            <svg viewBox="0 0 16 16" aria-hidden="true">
                                <rect x="1" y="9" width="3.5" height="6" rx="1" />
                                <rect x="6.25" y="5" width="3.5" height="10" rx="1" />
                                <rect x="11.5" y="1" width="3.5" height="14" rx="1" />
                            </svg>
                        </span>
                        <span>
                            <span className="home-link-name">Management</span>
                            <span className="home-link-desc">Business metrics and reports</span>
                        </span>
                    </button>
                    </RoleGate>

                </div>
            </div>
        </div>
    );



}

export default App;
