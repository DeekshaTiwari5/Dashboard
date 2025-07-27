import React from "react";
import api from "../../src/services/api";
import "../App.css";
import Clock from "../services/clock"
import "../services/clock.css"
import { useNavigate } from "react-router-dom";

function Attendance() {
    const navigate = useNavigate();
   const handleCheckIn = async () => {
    try {
        const response = await api.post("/attendance/checkin", {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        console.log(response.data);
        alert("Checked in");
        navigate("/profile", { state: { refresh: true } });

    } catch (error) {
        console.log("Check-In Error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Error occurred");
         navigate("/profile");
    }
};


    const handleCheckOut = async () => {
        await api.post("/attendance/checkout", {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        alert("Checked out");
        navigate("/profile", { state: { refresh: true } });

    };

    return (
        <div className="page-container">
            <h2>Check-In Check-Out</h2>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
               <Clock/>
            </div>
            <button onClick={handleCheckIn} type="submit">Check In</button>
            <button className="secondary" onClick={handleCheckOut} type="submit">Check Out</button>
        </div>
    );
}

export default Attendance;