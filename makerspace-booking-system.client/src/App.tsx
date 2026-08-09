import { useEffect, useState } from 'react';
import './App.css';

interface Tool {
    Id: number;
    CreatedAt: Date;
    Name: string;
    IsTakenOut: boolean;
    MaintenancePeriod: number;
    LastMaintained: Date;
}

function App() {
    const [tools, setTools] = useState<String[]>();

    useEffect(() => {
        populateWeatherData();
    }, []);

    const contents = tools === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
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
                {tools.map((name, idx) =>
                    <tr key={idx}>
                        <td>{name}</td>
                    </tr>
                    // <tr key={tools.Id}>
                    //     <td>{tools.Id}</td>
                    //     <td>{tools.Name}</td>
                    //     <td>{tools.IsTakenOut}</td>
                    //     <td>{tools.MaintenancePeriod}</td>
                    //     <td>{tools.LastMaintained.toDateString()}</td>
                    // </tr>
                )}
            </tbody>
        </table>;

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