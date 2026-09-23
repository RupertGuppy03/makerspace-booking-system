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
import { ManagementBarIcon } from '../../components/Management/ManagementIcons';
import { useDashboardMetrics } from './useDashboardMetrics';

/*
 * The three sections of the dashboard, in the order they appear in the rail.
 *
 * Each one carries a `to`, which tells the shared sidebar to draw it as a real
 * link that changes the address bar - as opposed to the admin page, whose items
 * have no `to` and become buttons instead.
 */
const SECTIONS = [
    { id: 'revenue', label: 'Revenue', to: 'revenue' },
    { id: 'users', label: 'User', to: 'users' },
    { id: 'tools', label: 'Tool', to: 'tools' },
];

// Links out to the other two pages, drawn underneath the sections.
const PAGE_LINKS = [
    { label: 'Admin', to: '/admin' },
    { label: 'User page', to: '/user' },
];

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
        <div className="management-shell management-surface">
            {/*
              * The rail is shared with the admin page, so it is told what to
              * show rather than deciding for itself. activeId reuses the
              * lastSegment we already worked out for the breadcrumb.
              */}
            <ManagementSidebar
                heading="Dashboard"
                items={SECTIONS}
                activeId={lastSegment}
                icon={<ManagementBarIcon />}
                pageLinks={PAGE_LINKS}
            />

            <div className="management-main">
                <header>
                    <h1 className="management-title">{sectionLabel}</h1>
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
