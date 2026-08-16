import { useAuth } from '../lib/authProvider';
import { supabase } from "../lib/supabaseClient";

export default function AccountBanner() {

    const { user } = useAuth();
    const userEmail = user?.email ?? 'not logged in';


    return (
        <div className="">
            <p>Current email: {userEmail}</p>
            {user 
                ? <button onClick={handleLogout}>logout</button>
                : <div>
                    <button onClick={() => alert("Go to /signup yourself")}>go to /signup</button>
                    <button onClick={() => alert("Go to /login yourself")}>go to /login</button>
                </div>
            }
        </div>
    );

    function handleLogout() {
        supabase.auth.signOut();
    }


}