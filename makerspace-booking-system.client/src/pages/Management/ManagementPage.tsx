/**
 * The manager dashboard: a read-only view of how the makerspace is running —
 * what is being used, who returns late, which tools are most in demand and
 * which get damaged most often.
 *
 * This file is the frame, not the content. It draws the sidebar, the page
 * heading and the breadcrumb, then leaves a hole where React Router drops in
 * whichever section the address bar is pointing at (Revenue, User or Tool).
 *
 * Access is meant to be restricted to the manager role. That check does not
 * exist yet.
 */

import { Outlet, useLocation } from 'react-router-dom';
import './ManagementPage.css';
import ManagementSidebar from '../../components/Management/ManagementSidebar';
import { useDashboardMetrics } from './useDashboardMetrics';

// Turns the address into something readable for the breadcrumb.
const SECTION_LABELS: Record<string, string> = {
    revenue: 'Revenue',
    users: 'User',
    tools: 'Tool',
};

function ManagementPage() {
    /*
     * Fetched once, here in the frame, rather than in each section. Whichever
     * section is on screen receives it through the Outlet below, so switching
     * between Revenue and Tool does not trigger another trip to the server.
     */
    const { metrics, loading, error } = useDashboardMetrics();

    /*
     * Tells us the current address, e.g. "/management/revenue". We take the
     * last part of it to work out which section name to show in the breadcrumb.
     */
    const location = useLocation();
    const lastSegment = location.pathname.split('/').filter(Boolean).pop() ?? 'revenue';
    const sectionLabel = SECTION_LABELS[lastSegment] ?? 'Revenue';

    return (
        <div className="management-shell">
            <ManagementSidebar />

            <div className="management-main">
                <header className="management-header">
                    <h1 className="management-title">Manager Dashboard</h1>
                    <p className="management-breadcrumb">
                        Home / Dashboard / <span>{sectionLabel}</span>
                    </p>
                </header>

                <main className="management-panel">
                    {/*
                      * Outlet is React Router's placeholder. Whichever child route
                      * matches the address gets rendered right here. The context
                      * prop is how we hand the fetched figures down to it.
                      */}
                    <Outlet context={{ metrics, loading, error }} />
                </main>
            </div>
        </div>
    );
}

export default ManagementPage;
