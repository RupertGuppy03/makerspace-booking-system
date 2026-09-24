import { useEffect, useState } from 'react';
import type { Tool } from "../../types/tool";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from '../../lib/authProvider';
import RoleGate from '../../components/RoleGate';
import UserSidebar from '../../components/User/UserSidebar';



function UserPage() {

    const navigate = useNavigate();
    const [tools, setTools] = useState<Tool[]>();
    const { user } = useAuth();
    const [searchName, setSearchName] = useState<string>("");
    

    useEffect(() => {
        populateToolData();

        
    }, []);

    /*
     * The tools table, in a white card.
     *
     * The heading row is always drawn. Underneath it, the body shows one of
     * three things: a "Loading..." row while the tools are still arriving, a
     * "no match" row when the search matches nothing, or one row per tool.
     */
    const table =
        <div className="user-table-card">
            <table className="user-table" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Maintenance period</th>
                        <th>Last maintained</th>
                        <RoleGate requiredRole='user'>
                            {/* The Reserve button's column. No heading to give it. */}
                            <th></th>
                        </RoleGate>
                    </tr>
                </thead>
                <tbody>
                    {tools === undefined && (
                        <tr>
                            <td colSpan={6} className="user-table-empty">Loading tools...</td>
                        </tr>
                    )}

                    {tools !== undefined && filterTools(tools).length === 0 && (
                        <tr>
                            <td colSpan={6} className="user-table-empty">No tools match your search.</td>
                        </tr>
                    )}

                    {tools !== undefined && filterTools(tools).map((tool, idx) =>
                        <tr key={idx}>
                            <td className="user-mono">{tool.id}</td>
                            <td>{tool.name}</td>
                            <td>
                                {/* A coloured label instead of printing true/false. */}
                                {tool.isTakenOut
                                    ? <span className="user-pill user-pill--blue">Taken out</span>
                                    : <span className="user-pill user-pill--green">Available</span>}
                            </td>
                            <td>{tool.maintenancePeriod} days</td>
                            <td>{tool.lastMaintained ? new Date(tool.lastMaintained).toDateString() : ''}</td>
                            <RoleGate requiredRole='user'>
                                <td className="user-num">
                                    <button type="button" className="user-btn user-btn--primary" onClick={() => handleNavigateReserve(tool.id)}>Reserve</button>
                                </td>
                            </RoleGate>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>


    return (
        /*
         * The same frame as the admin page: the dark rail on the left, the
         * pale area on the right. Everything in user.css only works inside
         * .user-shell, so this outer div must stay.
         */
        <div className="user-shell">
            <UserSidebar activeId="tools" />

            <div className="user-main">
                <header>
                    <h1 id="tableLabel" className="user-title">User Tool View</h1>
                    <p className="user-breadcrumb">
                        Home / <span>User Tool View</span>
                    </p>
                </header>

                <main>
                    <p className="user-lede">Every tool that is currently available to book in the makerspace.</p>

                    <RoleGate requiredRole='user' reverse>
                        <p className="user-info-note">To make a reservation for a tool, you must create an account or log in.</p>
                    </RoleGate>

                    <input
                        type="search"
                        className="user-input"
                        placeholder="Search by name..."
                        aria-label="Search by name"
                        value={searchName}
                        onChange={handleSearchOnChange}
                    />
                    {table}
                </main>
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