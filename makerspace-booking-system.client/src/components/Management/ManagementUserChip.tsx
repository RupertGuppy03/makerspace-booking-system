/**
 * The signed-in person shown at the bottom of the sidebar.
 *
 * Placeholder for now: the name and role are passed in, and the caller supplies
 * fixed values. When we wire this up it becomes one line — read the user from
 * useAuth() in lib/authProvider.tsx, which already wraps the whole app, and
 * pass the real values in here instead.
 */

type Props = {
    name: string;
    role: string;
};

// "Rupert Guppy" -> "RG". Falls back to one letter for a single-word name.
function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

function ManagementUserChip({ name, role }: Props) {
    return (
        <div className="management-sidebar-user">
            <span className="management-sidebar-avatar">{initials(name)}</span>
            <span>
                <span className="management-sidebar-username">{name}</span>
                <span className="management-sidebar-role">{role}</span>
            </span>
        </div>
    );
}

export default ManagementUserChip;
