/**
 * The dark navigation rail down the left of the manager dashboard.
 *
 * Takes no props — it reads the current address itself to decide which link to
 * highlight, so nothing needs to be passed in from the page.
 */

import { NavLink } from 'react-router-dom';
import './ManagementSidebar.css';

// Each section of the dashboard, in the order they appear in the rail.
const SECTIONS = [
    { to: 'revenue', label: 'Revenue' },
    { to: 'users', label: 'User' },
    { to: 'tools', label: 'Tool' },
];

// Small icon drawn next to each link. Written out by hand so the sidebar does
// not need an icon library installed.
function SectionIcon() {
    return (
        <svg className="management-sidebar-icon" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1" y="9" width="3.5" height="6" rx="1" />
            <rect x="6.25" y="5" width="3.5" height="10" rx="1" />
            <rect x="11.5" y="1" width="3.5" height="14" rx="1" />
        </svg>
    );
}

function ManagementSidebar() {
    return (
        <aside className="management-sidebar">
            <div className="management-sidebar-brand">
                <span className="management-sidebar-mark">M</span>
                <span className="management-sidebar-name">Makerspace</span>
            </div>

            <p className="management-sidebar-heading">Dashboard</p>

            <nav className="management-sidebar-nav" aria-label="Dashboard sections">
                {SECTIONS.map((section) => (
                    <NavLink
                        key={section.to}
                        to={section.to}
                        /*
                         * NavLink hands us an isActive flag telling us whether this
                         * link matches the address bar. We use it to add the class
                         * that draws the blue bar down the left of the active item.
                         */
                        className={({ isActive }) =>
                            isActive
                                ? 'management-sidebar-link management-sidebar-link--active'
                                : 'management-sidebar-link'
                        }
                    >
                        <SectionIcon />
                        {section.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default ManagementSidebar;
