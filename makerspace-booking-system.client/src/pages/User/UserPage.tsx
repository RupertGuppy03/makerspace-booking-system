import './UserPage.css';

interface Tool {
    id: number;
    createdAt: Date;
    name: string;
    isTakenOut: boolean;
    maintenancePeriod: number;
    lastMaintained: Date;
}


function UserPage() {


    
    return (
        <div>
            <h1 id="tableLabel">User Page</h1>
            <p>This component demonstrates the user page</p>
        </div>
    );

   
}

export default UserPage;