import { useEffect, useState } from 'react';
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
    const [tools, setTools] = useState<Tool[]>();

    useEffect(() => {
        populateWeatherData();
    }, []);

    const contents = tools === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <div>
            <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Is Taken Out</th>
                    <th>Maintenance Period</th>
                    <th>Last Maintained</th>
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
                    </tr>
                )}
            </tbody>
        </table>
            <p>
        </p>
        </div>;

    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        if (response.ok) {
            const data = await response.json();
            setTools(data);
        }
    }
}

export default App;