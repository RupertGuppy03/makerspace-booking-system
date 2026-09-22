import { useState } from 'react';
import './AdminPage.css';
import { useAuth } from '../../lib/authProvider';

import AdminSidebar, { type AdminSection } from '../../components/Admin/AdminSidebar';
import AdminDashboardSection from '../../components/Admin/AdminDashboardSection';
import AdminInventorySection from '../../components/Admin/AdminInventorySection';
import AdminAddToolSection from '../../components/Admin/AdminAddToolSection';
import AdminReservationSection from '../../components/Admin/AdminReservationSection';
import AdminMaintenanceSection from '../../components/Admin/AdminMaintenanceSection';
import AccessDenied from '../AccessDenied/AccessDenied';

function AdminPage() {

    const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
    const { role } = useAuth();

    //Only allow access if logged in with admin role or higher
    if (role != 'admin' && role != 'manager') { 
        return <AccessDenied />;
    }



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