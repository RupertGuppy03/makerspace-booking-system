import { useEffect, useState } from 'react';
import './UserPage.css';
import type { Tool } from "../../types/tool";
import { useAuth } from '../../lib/authProvider';
import type { NewReservation } from '../../types/newReservasion';
import AccountBanner from '../../components/accountBanner'


function UserPage() {


    const [tools, setTools] = useState<Tool[]>();
    const { user } = useAuth();
    

    useEffect(() => {
        populateToolData();
    }, []);

    const table = tools === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Is Taken Out</th>
                    <th>Maintenance Period (days)</th>
                    <th>Last Maintained</th>
                    <th>Reserve Button</th>
                </tr>
            </thead>
            <tbody>
                {tools.map((tool, idx) =>
                    <tr key={idx}>
                        <td>{tool.id}</td>
                        <td>{tool.name}</td>
                        <td>{tool.isTakenOut ? "true" : "false"}</td>
                        <td>{tool.maintenancePeriod}</td>
                        <td>{tool.lastMaintained ? new Date(tool.lastMaintained).toDateString() : ''}</td>
                        <td><button type="button" onClick={() => handleReserve(tool.id) }> reserve </button></td>
                    </tr>
                )}
            </tbody>
        </table>


    return (
        <div>
            <AccountBanner />
            <h1 id="tableLabel">User Tool View</h1>
            <p>This page shows all tools from the database and allows you to reverse one if logged in</p>
            <br />
            <div>
                {table}

            </div>
        </div>
    );



    async function populateToolData() {
        const response = await fetch('/api/tools');
        if (response.ok) {
            const data = await response.json();
            setTools(data);
        }
    }

    async function handleReserve(toolId : number) {
        if (!user) {
            alert("Must be logged in to reserve a tool");
            return;
        }
        alert("Reserve Pressed")

        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 1);

        const reservation: NewReservation = {
            startDay: new Date(),
            endDay: endDate,
            toolId: toolId,
            userId: user.id
        };

        const response = await fetch("/api/reservation", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservation)
        });

        const data = await response.json()
        alert(`reservation created: ${data}`);
        return data; //TODO does this return to anywhere?

    }
   
}

export default UserPage;