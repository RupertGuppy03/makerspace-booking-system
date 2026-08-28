
import './App.css';
import AccountBanner from './components/accountBanner';
import { useNavigate } from "react-router-dom";



function App() {
    const navigate = useNavigate();

    return (
        <div>
            <AccountBanner />
            <h1 id="tableLabel">Available Pages</h1>
            <button onClick={() => navigate("user")}>User Tool View</button>
            <button onClick={() => navigate("user/reservations")}>Your Reservations</button>
            <button onClick={() => navigate("admin")}>Admin</button>
            <button onClick={() => navigate("management")}>Management</button>
        </div>
    );



}

export default App;