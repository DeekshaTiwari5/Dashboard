import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Header() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="header-green" style={{ padding: "10px 20px", position: "relative" }}>
            {/* Desktop Navigation */}
            <div className="nav-links desktop-nav" style={{ display: "flex", gap: "20px", alignItems: "baseline", justifyContent: "space-between" }}>
                <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
                <Link to="/attendance" style={{ color: "white", textDecoration: "none" }}>Attendance</Link>
                <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</Link>
                <button onClick={handleLogout} style={{ background: "white", color: "#00b87c", border: "none", padding: "6px 12px", borderRadius: "4px" }}>
                    Logout
                </button>
            </div>

            {/* Hamburger Icon */}
            <div className="mobile-nav-icon" onClick={toggleMenu}>
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="mobile-menu-dropdown">
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    <Link to="/attendance" onClick={() => setMenuOpen(false)}>Attendance</Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                    <button onClick={handleLogout} style={{ background: "white", color: "#00b87c", border: "none", padding: "6px 12px", borderRadius: "4px" }}>
                    Logout
                </button>
                </div>
            )}
        </div>
    );
}

export default Header;
