import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="text-center" style={{ color: "white" }} >
            <h3>You do not have permission to access this page.</h3>
            <button onClick={() => navigate("/") } >Go Back to Home</button>
        </div>
    )
}