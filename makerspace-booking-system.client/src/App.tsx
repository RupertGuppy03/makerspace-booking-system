
import './App.css';
import AccountBanner from './components/accountBanner';
import { useNavigate } from "react-router-dom";



function App() {
    const navigate = useNavigate();

    return (
        <div>
            <AccountBanner />
            <h1 id="tableLabel">Available Pages</h1>
            <h3 id="tableLabel">(Links now clickable)</h3>
            <p onClick={() => navigate("user")}>/user</p>
            <p onClick={() => navigate("user/reservations")}>/user/reservations</p>
            <p onClick={() => navigate("admin")}>/admin</p>
            <p onClick={() => navigate("management")}>/management</p>
        </div>
    );



}

export default App;