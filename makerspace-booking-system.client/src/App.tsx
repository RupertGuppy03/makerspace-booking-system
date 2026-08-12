import { useEffect, useState } from 'react';
import { supabase } from "./lib/supabaseClient"
import './App.css';


//Attritubes of Tool here must be in camelCase, even though in the server they are in PascalCase
interface Tool {
    id: number;
    createdAt: Date;
    name: string;
    isTakenOut: boolean;
    maintenancePeriod: number;
    lastMaintained: Date;
}

function App() {

    return (
        <div>
            <h1 id="tableLabel">Available Pages</h1>
            <p>/signup</p>
            <p>/login</p>
            <p>/user</p>
            <p>/user/reservations (TODO)</p>
        </div>
    );



}

export default App;