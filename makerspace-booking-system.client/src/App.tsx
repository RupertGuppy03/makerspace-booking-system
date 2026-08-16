
import './App.css';
import AccountBanner from './components/accountBanner';


function App() {

    return (
        <div>
        <AccountBanner />
            <h1 id="tableLabel">Available Pages</h1>
            <p>/signup</p>
            <p>/login</p>
            <p>/userpage</p>
            <p>/userpage/reservations</p>
            <p>/managementpage</p>
        </div>
    );



}

export default App;