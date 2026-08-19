/**
 * 
 * 
 * this is the managment page, a read only view of how th emakerspace is running, whats being used
 * who returns late, what tools are being used the most, and what tools are being damaged the most
 * 
 * three tabs, one for revenue, one for user metrics, and one for tool metrics
 * 
 * access to this page is restricted to only users with the manager role
 * 
 * 
 */

import {useState} from 'react';
import './ManagementPage.css';
import ManagementRevenueSection from '../../components/Management/ManagementRevenueSection';
import ManagementUserSection from '../../components/Management/ManagementUserSection';
import ManagementToolSection from '../../components/Management/ManagementToolSection';

type Tab = 'revenue' | 'users' | 'tools';

/**
 * 
 * this is the main management page, it will display the three tabs for revenue, user metrics, and tool metrics
 * 
 */

const TABS: { id: Tab; label: string }[] = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'users', label: 'User' },
    { id: 'tools', label: 'Tool' },
];

function ManagementPage() {
    const [activeTab, setActiveTab] = useState<Tab>('revenue');

    return (
        <div className="management-dashboard">
            <header className="management-header">
                <h1>Manager Dashboard</h1>
                <p className="management-subtitle">
                    An overview of how the makerspace is running. Figures cover the last 12 months.
                </p>
            </header>

            <p className="management-banner">
                Prototype - the management dashboard is still in development
            </p>

            <nav className="management-tabs" role="tablist" aria-label="Management Dashboard Tabs">
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

            <main className="management-panel">
                {activeTab === 'revenue' && <ManagementRevenueSection />}
                {activeTab === 'users' && <ManagementUserSection />}
                {activeTab === 'tools' && <ManagementToolSection />}
            </main>
        </div>
    );
}

export default ManagementPage;
