import { useAuth } from '../lib/authProvider';
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";


/*
 * Addresses this banner stays out of the way on. The login and signup pages
 * have their own sign-in card, so a second set of buttons above it just looks
 * messy. Every other page shows the banner as normal.
 */
const HIDDEN_ON = ['/login', '/signup'];


export default function AccountBanner() {


    const navigate = useNavigate();
    const { user } = useAuth();
    const userEmail = user?.email ?? 'not logged in';

    /*
     * Tells us the address currently in the bar, e.g. "/login".
     *
     * This has to sit here with the other three lines above it, not lower down.
     * React needs every hook (the use... functions) to run in the same order on
     * every single redraw, so none of them may end up behind an if or a return.
     */
    const location = useLocation();

    // Returning null is React for "draw nothing at all here".
    if (HIDDEN_ON.includes(location.pathname)) {
        return null;
    }


    return (
        <div className="">
            <p>Current email: {userEmail}</p>
            {user 
                ? <button onClick={handleLogout}>logout</button>
                : <div>
                    <button onClick={() => navigate("/signup")}>signup</button>
                    <button onClick={() => navigate("/login")}>login</button>
                </div>
            }
        </div>
    );


    function handleLogout() {
        navigate("/")
        supabase.auth.signOut();
    }


}
