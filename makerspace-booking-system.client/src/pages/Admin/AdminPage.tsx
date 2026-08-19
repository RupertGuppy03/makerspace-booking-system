import { useState } from 'react';
import './AdminPage.css';

import AdminSidebar, { type AdminSection } from '../../components/AdminSidebar';
import AdminDashboardSection from '../../components/AdminDashboardSection';
import AdminInventorySection from '../../components/AdminInventorySection';
import AdminAddToolSection from '../../components/AdminAddToolSection';
import AdminReportSection from '../../components/AdminReportSection';
import AdminMaintenanceSection from '../../components/AdminMaintenanceSection';

function AdminPage() {
    const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

    return (
        <div className="admin-dashboard">
            <AdminSidebar activeSection={activeSection} onSelect={setActiveSection} />

            <main className="admin-panel">
                {activeSection === 'dashboard' && <AdminDashboardSection />}
                {activeSection === 'inventory' && <AdminInventorySection />}
                {activeSection === 'addTool' && <AdminAddToolSection />}
                {activeSection === 'report' && <AdminReportSection />}
                {activeSection === 'maintenance' && <AdminMaintenanceSection />}
            </main>
        </div>
    )
}

export default AdminPage;