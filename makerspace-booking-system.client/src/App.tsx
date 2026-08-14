import { useEffect, useState } from 'react';
import { supabase } from "./lib/supabaseClient";
import './App.css';
import AccountBanner from './components/accountBanner';


function App() {

    return (
        <div>
        <AccountBanner />
            <h1 id="tableLabel">Available Pages</h1>
            <p>/signup</p>
            <p>/login</p>
            <p>/user</p>
            <p>/user/reservations (TODO)</p>
        </div>
    );



}

export default App;