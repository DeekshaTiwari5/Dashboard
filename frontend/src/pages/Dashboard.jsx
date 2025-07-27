import React, { useEffect, useState } from "react";
// import api from "../../src/services/api";
import "../App.css";
import Pagination from "../components/Pagination";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";

function Dashboard() {
  const [page, setPage] = useState(1);

  const [attendanceData, setAttendanceData] = useState([]);
  const itemsPerPage = 10;
  const paginatedData = attendanceData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getAttendance = async () => {
    console.log({ getAttendance });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/attendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Attendance fetched:");
      console.table(
        res.data.map((item) => ({
          Date: item.date,
          Name: item.userId?.name || "Not populated",
          EmpCode: item.userId?.employeeId || "Not populated",
          CheckIn: item.checkIn,
        }))
      );

      setAttendanceData(res.data);
    } catch (error) {
      console.error("❌ Attendance fetch error:", error);
    }
  };

  useEffect(() => {
    getAttendance();
  }, []);

  return (
    <div className="page-container dashboard">
      <div className="header-green">
        <h2>Dashboard</h2>
        <div className="search">
          <div className="searchbar">
            {" "}
            <IoSearchOutline />
          </div>

          <input className="searchinput" placeholder=" Search by date"></input>
        </div>
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
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>
                {new Date(item.date)
                  .toLocaleString("en-US", { month: "long", day: "2-digit" })
                  .replace(",", "")}
              </td>
              <td>{item.userId?.name}</td>
              <td>{item.userId?.employeeId}</td>

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
      {attendanceData.length > 10 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(attendanceData.length / 10)}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}

export default Dashboard;
