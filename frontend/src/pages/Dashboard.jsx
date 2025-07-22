import React, { useEffect, useState } from "react";
import api from "../../src/services/api";
import "../App.css";
import { useUser } from "../context/UserContext";
import { IoSearchOutline } from "react-icons/io5";

function Dashboard() {
  const { attendance, setAttendance } = useUser();

  const fetchAttendance = async () => {
  try {
    const response = await api.get("/attendance", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    console.log("Attendance API Response:", response.data);
    setAttendance(response.data);
  } catch (error) {
    console.error("Fetch Attendance Error:", error);
  }
};

  useEffect(() => {
    fetchAttendance();
  }, []);
  return (
    <div className="page-container">
      <div className="header-green">
        <h2>Dashboard</h2>
        <div className="searchbar">
          {" "}
          <IoSearchOutline />
        </div>

        <input placeholder="       Search by date"></input>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Emp Name</th>
            <th>Emp Code</th>
            <th>Check In Time</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.userId?.name || "-"}</td>
            <td>{item.userId?.employeeId || "-"}</td>

              <td>
                {item.checkIn
                  ? new Date(item.checkIn).toLocaleTimeString()
                  : "-"}
              </td>
              {/* <td>{item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : "-"}</td> */}
              <td>Office</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
