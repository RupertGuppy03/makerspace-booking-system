/**
 * The dark navigation rail down the left of the user pages.
 *
 * It is the same rail the manager dashboard and the admin page use
 * (ManagementSidebar). This file only decides what goes in it: a link to
 * User Tool View and, for signed-in visitors, a link to My reservations.
 *
 * Props:
 * - activeId   which link to highlight: 'tools' or 'reservations'
 */

import { useAuth } from '../../lib/authProvider';
import ManagementSidebar, { type SidebarItem } from '../Management/ManagementSidebar';
import {
    ManagementCalendarIcon,
    ManagementHammerIcon,
} from '../../assets/Icons';

type Props = {
    activeId: 'tools' | 'reservations';
};

function UserSidebar({ activeId }: Props) {
    // The visitor's role. It is 'guest' when nobody is logged in.
    const { role } = useAuth();

    // User Tool View is for everyone, signed in or not.
    const items: SidebarItem[] = [
        { id: 'tools', label: 'User Tool View', to: '/user', icon: <ManagementHammerIcon /> },
    ];

    /*
     * My reservations is only listed for signed-in visitors.
     *
     * This only tidies the rail - it is not what keeps guests out. Someone can
     * still type /user/reservations into the address bar, and it is the role
     * check at the top of Reservations.tsx that turns them away.
     */
    if (role !== 'guest') {
        items.push({
            id: 'reservations',
            label: 'My reservations',
            to: '/user/reservations',
            icon: <ManagementCalendarIcon />,
        });
    }

    return (
        <ManagementSidebar
            heading="Browse"
            items={items}
            activeId={activeId}
            icon={<ManagementHammerIcon />}
        />
    );
}

export default UserSidebar;
