import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Header() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="header-green" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>

            <div style={{ display: "flex", gap: "20px" }}>
                <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
                <Link to="/attendance" style={{ color: "white", textDecoration: "none" }}>Attendance</Link>
                <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</Link>
                <button onClick={handleLogout} style={{ background: "white", color: "#00b87c", border: "none", padding: "6px 12px", borderRadius: "4px" }}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Header;
