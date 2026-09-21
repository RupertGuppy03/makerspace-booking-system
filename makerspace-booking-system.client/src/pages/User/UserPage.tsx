import { useEffect, useState } from 'react';
import './UserPage.css';
import type { Tool } from "../../types/tool";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from '../../lib/authProvider';



function UserPage() {

    const navigate = useNavigate();
    const [tools, setTools] = useState<Tool[]>();
    const { user } = useAuth();
    const [searchName, setSearchName] = useState<string>("");
    

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
                {filterTools(tools).map((tool, idx) =>
                    <tr key={idx}>
                        <td>{tool.id}</td>
                        <td>{tool.name}</td>
                        <td>{tool.isTakenOut ? "true" : "false"}</td>
                        <td>{tool.maintenancePeriod}</td>
                        <td>{tool.lastMaintained ? new Date(tool.lastMaintained).toDateString() : ''}</td>
                        <td><button type="button" onClick={() => handleNavigateReserve(tool.id)}> reserve </button></td>
                    </tr>
                )}
            </tbody>
        </table>


    return (
        <div>
            <h1 id="tableLabel">User Tool View</h1>
            <p>This page shows all tools from the database and allows you to reverse one if logged in</p>
            <br />
            <div>
                <input placeholder="Search by Name" value={searchName} onChange={handleSearchOnChange} />
                {table}
            </div>
        </div>
    );

    function filterTools(tools: Tool[]): Tool[] {


        //Filter out unmaintained tools
        const now = new Date()
        const millisecondsInDay = 24*60*60*1000
        let maintainedTools = tools.filter(t => {
            const millisecondsSinceMaintained = now.getTime() - t.lastMaintained.getTime()
            const daysSinceMaintained = Math.floor(millisecondsSinceMaintained / millisecondsInDay)
            return daysSinceMaintained < t.maintenancePeriod // Allow tool if the days since maintained has not reached or exceeded the maintainance period
        })
        //Filter by search term
        let filteredTools = maintainedTools.filter(t => (t.name.toLowerCase().includes(searchName.toLowerCase()) || searchName == ""))
        return filteredTools;

    }



    async function populateToolData() {
        const response = await fetch('/api/tools');
        if (response.ok) {
            const data = await response.json();

            const toolList = data.map((tool: any) => ({ //Convert Date type properties from string to Date, as Typescript does not auto convert it.
                ...tool,
                createdAt: new Date(tool.createdAt),
                lastMaintained: new Date(tool.lastMaintained)
            }));
            setTools(toolList);
        }
    }

    async function handleNavigateReserve(toolId: number) {

        if (!user) {
            alert("You must be logged in to reserve a tool");
            return;
        }

        const toolIdStr = toolId.toString();

        navigate({
            pathname: "/user/reserve",
            search: createSearchParams({
                toolId: toolIdStr
            }).toString()
        });

    }

    async function handleSearchOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchName(e.currentTarget.value)
    }
   
}

export default UserPage;