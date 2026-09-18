import { useState } from 'react';
import './AdminPage.css';

import AdminSidebar, { type AdminSection } from '../../components/Admin/AdminSidebar';
import AdminDashboardSection from '../../components/Admin/AdminDashboardSection';
import AdminInventorySection from '../../components/Admin/AdminInventorySection';
import AdminAddToolSection from '../../components/Admin/AdminAddToolSection';
import AdminReservationSection from '../../components/Admin/AdminReservationSection';
import AdminMaintenanceSection from '../../components/Admin/AdminMaintenanceSection';

function AdminPage() {
    const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

    return (
        <div className="admin-dashboard">
            <AdminSidebar activeSection={activeSection} onSelect={setActiveSection} />

            <main className="admin-panel">
                {activeSection === 'dashboard' && <AdminDashboardSection />}
                {activeSection === 'inventory' && <AdminInventorySection />}
                {activeSection === 'addTool' && <AdminAddToolSection />}
                {activeSection === 'reservations' && <AdminReservationSection />}
                {activeSection === 'maintenance' && <AdminMaintenanceSection />}
            </main>
        </div>
    )
}

export default AdminPage;