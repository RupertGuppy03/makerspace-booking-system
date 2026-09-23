import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div>
            <h4>You do not have permission to access this page.</h4>
            <button onClick={() => navigate("/") } >Go Back to Home</button>
        </div>
    )
}