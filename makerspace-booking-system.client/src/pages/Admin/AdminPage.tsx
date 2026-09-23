/**
 * The admin page: the day-to-day running of the makerspace. Tool inventory,
 * reservations, registering new tools and keeping on top of servicing.
 *
 * This file is the frame, not the content. It draws the rail, the heading and
 * the breadcrumb, then renders whichever section is currently open.
 *
 * Unlike the manager dashboard, the open section is kept in a variable rather
 * than in the address bar, so every section lives at /admin.
 */

import { useState } from 'react';
import './AdminPage.css';
import { useAuth } from '../../lib/authProvider';

import ManagementSidebar from '../../components/Management/ManagementSidebar';
import { ManagementGridIcon } from '../../components/Management/ManagementIcons';
import AdminDashboardSection from '../../components/Admin/AdminDashboardSection';
import AdminInventorySection from '../../components/Admin/AdminInventorySection';
import AdminAddToolSection from '../../components/Admin/AdminAddToolSection';
import AdminReservationSection from '../../components/Admin/AdminReservationSection';
import AdminMaintenanceSection from '../../components/Admin/AdminMaintenanceSection';
import AccessDenied from '../AccessDenied/AccessDenied';

// The five sections, and the only values activeSection is allowed to hold.
export type AdminSection = 'dashboard' | 'inventory' | 'reservations' | 'addTool' | 'maintenance';

/*
 * The sections in the order they appear in the rail.
 *
 * None of them carries a `to`, which is what tells the shared sidebar to draw
 * them as buttons rather than links - clicking one changes the variable below
 * instead of the address bar.
 */
const ADMIN_SECTIONS: { id: AdminSection; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'addTool', label: 'Add tools' },
    { id: 'maintenance', label: 'Maintenance' },
];

// The one link out of the admin page. The manager dashboard is deliberately
// not listed - admins are not meant to reach it.
const PAGE_LINKS = [{ label: 'User page', to: '/user' }];

function AdminPage() {
    /*
     * Which section is on screen. Starts on the dashboard, and changes when a
     * button in the rail is clicked. Changing it redraws the page with a
     * different section inside.
     */
    const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
    const { role } = useAuth();

    //Only allow access if logged in with admin role or higher
    if (role != 'admin' && role != 'manager') { 
        return <AccessDenied />;
    }



    // The heading and breadcrumb read the label out of the list above, so the
    // two can never drift apart from what the rail says.
    const sectionLabel =
        ADMIN_SECTIONS.find((section) => section.id === activeSection)?.label ?? 'Dashboard';

    return (
        <div className="admin-shell">
            {/*
              * The same rail the manager dashboard uses. It is told what to
              * show rather than deciding for itself, which is what lets one
              * component serve both pages.
              */}
            <ManagementSidebar
                heading="Admin"
                items={ADMIN_SECTIONS}
                activeId={activeSection}
                onSelect={(id) => setActiveSection(id as AdminSection)}
                icon={<ManagementGridIcon />}
                pageLinks={PAGE_LINKS}
            />

            <div className="admin-main">
                <header>
                    <h1 className="admin-title">{sectionLabel}</h1>
                    <p className="admin-breadcrumb">
                        Home / Admin / <span>{sectionLabel}</span>
                    </p>
                </header>

                <main>
                    {activeSection === 'dashboard' && <AdminDashboardSection />}
                    {activeSection === 'inventory' && <AdminInventorySection />}
                    {activeSection === 'addTool' && <AdminAddToolSection />}
                    {activeSection === 'reservations' && <AdminReservationSection />}
                    {activeSection === 'maintenance' && <AdminMaintenanceSection />}
                </main>
            </div>
        </div>
    );
}

export default AdminPage;
