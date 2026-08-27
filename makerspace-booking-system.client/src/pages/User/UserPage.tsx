import { useEffect, useState } from 'react';
import './UserPage.css';
import type { Tool } from "../../types/tool";
import AccountBanner from '../../components/accountBanner'
import { createSearchParams, useNavigate } from "react-router-dom";


//TODO have this page use the same tab system as Management for future/active/old reservations
function UserPage() {

    const navigate = useNavigate();
    const [tools, setTools] = useState<Tool[]>();
    //const { user } = useAuth();
    

    useEffect(() => {
        populateToolData();
    }, []);

    const table = tools === undefined
        ? <p><em>Loading...</em></p>
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
                        <td><button type="button" onClick={() => handleNavigateReserve(tool.id) }> reserve </button></td>
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

    async function handleNavigateReserve(toolId: number) {

        const toolIdStr = toolId.toString();

        navigate({
            pathname: "/user/reserve",
            search: createSearchParams({
                toolId: toolIdStr
            }).toString()
        });

    }
   
}

export default UserPage;