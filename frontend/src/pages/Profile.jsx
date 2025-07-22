import React, { useEffect, useState, useRef } from "react";
import { FiMail, FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; 
import { ImProfile } from "react-icons/im";
import api from "../services/api";
import "../App.css";

function Profile() {
  const [user, setUser] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
   const navigate = useNavigate(); // ADD THIS HOOK

  const handleRedirectAttendance = () => {
    navigate("/attendance",{ state: { refresh: true } });

  };


  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await api.get("/auth/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const userData = res.data;
            const attendance = userData.attendance;

            setUser({
                ...userData,
                checkInTime: attendance?.checkIn ? new Date(attendance.checkIn).toLocaleTimeString() : "-",
                checkTime: attendance?.updatedAt ? new Date(attendance.updatedAt).toLocaleTimeString() : "-",
                duration: calculateDuration(attendance?.checkIn, attendance?.updatedAt),
            });
        } catch (error) {
            console.error("Fetch user or attendance failed", error);
        }
    };

    fetchData();
}, []);

const calculateDuration = (start, end) => {
    if (!start || !end) return "-";
    const diffMs = new Date(end) - new Date(start);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
};


  const profileImage = previewImage
    ? previewImage
    : user.profileImage
    ? `http://localhost:5000/uploads/${user.profileImage}`
    : require("../../src/assets/avatar.webp");

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await api.post("/auth/upload-avatar", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser((prev) => ({ ...prev, profileImage: res.data.fileName }));
      setPreviewImage(null);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  return (
    <div className="page-container profile-info">
      <div className="row align-items-center">
        <div className="col-6 info">
          <div className="avatar" onClick={handleImageClick} style={{ cursor: "pointer" }}>
            <img src={profileImage} alt="profile" className="profile-img" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
              accept="image/*"
            />
          </div>

          <div className="profile-details">
            <p className="prof-header">Profile</p>
            <p className="prof-name">{user.name || "John Doe"}</p>
            <p>{user.role || "Web Designer"}</p>
          </div>
        </div>
        <div className="info-details">
          <p>
            <span><FiMail /> </span> {user.email || "No Email"}
          </p>
          <p>
            <span><FiPhone /></span> {user.mobile || "No Mobile"}
          </p>
          <p>
            <span><ImProfile /></span> {user._id || "No ID"}
          </p>
        </div>
        <div className="table">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Emp Icod</th>
                 <th style={{ cursor: "pointer"}} onClick={handleRedirectAttendance}>
                Check in Time
              </th>
              <th style={{ cursor: "pointer"}} onClick={handleRedirectAttendance}>
                Check Time
              </th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.employeeId || "415469"}</td>
<td>{user.checkInTime || "-"}</td>
<td>{user.checkTime || "-"}</td>
<td>{user.duration || "-"}</td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Profile;
