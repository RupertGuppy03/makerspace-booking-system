
import './App.css';
import { useNavigate } from "react-router-dom";
import RoleGate from './components/RoleGate';



function App() {
    const navigate = useNavigate();

    return (
        <div>
            <h1 id="tableLabel">Available Pages</h1>
            <button onClick={() => navigate("user")}>User Tool View</button>
            <RoleGate requiredRole='user'>
                <button onClick={() => navigate("user/reservations")}>Your Reservations</button>
            </RoleGate>
            <RoleGate requiredRole='admin'>
                <button onClick={() => navigate("admin")}>Admin</button>
            </RoleGate>
            <RoleGate requiredRole='manager'>
                <button onClick={() => navigate("management")}>Management</button>
            </RoleGate>
        </div>
    );



}

export default App;