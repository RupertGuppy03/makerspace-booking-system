import { useAuth } from '../lib/authProvider';
import { supabase } from "../lib/supabaseClient";
import { createSearchParams, useNavigate } from "react-router-dom";


export default function AccountBanner() {


    const navigate = useNavigate();
    const { user } = useAuth();
    const userEmail = user?.email ?? 'not logged in';


    return (
        <div className="">
            <p>Current email: {userEmail}</p>
            {user 
                ? <button onClick={handleLogout}>logout</button>
                : <div>
                    <button onClick={() => navigate("signup")}>signup</button>
                    <button onClick={() => navigate("login")}>login</button>
                </div>
            }
        </div>
    );


    function handleLogout() {
        supabase.auth.signOut();
    }


}