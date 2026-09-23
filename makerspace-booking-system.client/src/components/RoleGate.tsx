import { useAuth } from '../lib/authProvider';
import type { Role } from '../types/role';

//Use this component to disable (or enable) any elements depending on the logged in user's current role
//Role is 'guest' when not logged in

interface PermissionGateProps {
    children: React.ReactNode,
    requiredRole: Role,
    reverse?: boolean
}

export default function RoleGate({ children, requiredRole, reverse = false}: PermissionGateProps) {

    const { role } = useAuth();

    //Returns whether the given role has equal or greater permission given a required role.
    //Each role has strictly higher permissions than the previous, in order of guest, user, admin, manager
    function hasPermission(auth: Role, requiredAuth: Role) {
        switch (auth) {
            case 'guest': {
                return requiredAuth == 'guest';
            }
            case 'user': {
                return requiredAuth == 'guest' || requiredAuth == 'user';
            }
            case 'admin': {
                return requiredAuth == 'guest' || requiredAuth == 'user' || requiredAuth == 'admin';
            }
            case 'manager': {
                return true;
            }
        } 
    }


    if (hasPermission(role, requiredRole) !== reverse) { //XOR hasPermission and reverse. Only show children if hasPermission is true, do the opposite if reverse is true.
        return children;
    } else {
        return;
    }

}