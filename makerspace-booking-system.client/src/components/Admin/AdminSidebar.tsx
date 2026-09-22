
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './AdminSidebar.css';

export type AdminSection = 'dashboard' | 'inventory' | 'addTool' | 'maintenance' | 'reservations';

export const ADMIN_SECTIONS: { id: AdminSection; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'addTool', label: 'Add Tools' },
    { id: 'maintenance', label: 'Maintenance' }
];

type Props = {
    activeSection: AdminSection;
    onSelect: (section: AdminSection) => void;
    onSignOut?: () => void; //will hookup the later
}

function AdminSidebar({ activeSection, onSelect, onSignOut }: Props) {

    return (
        <nav className="admin-sidebar" aria-label="Admin navigation">
            <div className="admin-sidebar-header">
                <span className="admin-sidebar-title">Admin Page</span>
                <div className="admin-sidebar-icons">
                    <AccountCircleIcon fontSize="small" aria-label="Account" />
                </div>
            </div>

            <ul className="admin-sidebar-list" role="tablelist">
                {ADMIN_SECTIONS.map((section) => (
                    <li key={section.id}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeSection === section.id}
                            className={
                                activeSection === section.id
                                    ? 'admin-sidebar-link admin-sidebar--active'
                                    : 'admin-sidebar-link'
                            }
                            onClick={() => onSelect(section.id)}
                        >
                            {section.id}
                        </button>
                    </li>
                ))}
            </ul>

            <button type="button" className="admin-sidebar-signout" onClick={onSignOut}>
                SignOut
            </button>
        </nav>
    );
}

export default AdminSidebar;