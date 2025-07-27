import React, { useEffect, useState, useRef } from "react";
import { FiMail, FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import axios from "axios";
import api from "../services/api";
import "../App.css";
import Header from "../components/Header";

function Profile() {
  const [user, setUser] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleRedirectAttendance = () => {
    navigate("/attendance", { state: { refresh: true } });
  };
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const attendance = data.attendance;

      const checkInTime = attendance?.checkIn
        ? new Date(attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "-";

      const checkTime = attendance?.checkOut
        ? new Date(attendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "-";

      const duration = attendance?.checkIn && attendance?.checkOut
        ? calculateDuration(attendance.checkIn, attendance.checkOut)
        : "-";

      setUser({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        employeeId: data.employeeId,
        role: data.role,
        profileImage: data.profileImage,
        checkInTime,
        checkTime,
        duration,
      });

      if (data.profileImage) {
        setPreviewImage(`${process.env.REACT_APP_IMAGE_URL}/${data.profileImage}`);
      }

    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  fetchProfile();
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
    ? `${process.env.REACT_APP_IMAGE_URL}/${user.profileImage}`
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

    console.log("📤 Uploading file:", file);

    try {
   const res = await axios.post(
  `${process.env.REACT_APP_API_URL}/profile/upload-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Upload success:", res.data);

      // Optional: Show uploaded file path or URL
      if (res.data.imagePath) {
        console.log("🖼️ Uploaded Image Path:", res.data.imagePath);
      }
      if (res.data && res.data.imagePath) {
        // Fetch updated profile after upload
        const profileRes = await api.get(
          `${process.env.REACT_APP_API_URL}/profile/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(profileRes.data);
        setPreviewImage(
          profileRes.data.profileImage
            ? `${process.env.REACT_APP_IMAGE_URL}/${profileRes.data.profileImage}`
            : null
        );
      }
    } catch (err) {
      if (err.response) {
        console.error("❌ Server responded with error:", err.response.data);
      } else if (err.request) {
        console.error(
          "❌ No response from server. Check network or CORS:",
          err.request
        );
      } else {
        console.error("❌ Upload error:", err.message);
      }
    }
  };

  return (
    <>
    <Header/>
     <div className="page-container profile-info">
      
      <div className="row align-items-center">
        <div className="col-6 info">
          <div
            className="avatar"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                previewImage
                  ? previewImage
                  : require("../../src/assets/avatar.webp")
              }
              alt="profile"
              className="profile-img"
            />
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
            <span>
              <FiMail />{" "}
            </span>{" "}
            {user.email || "No Email"}
          </p>
          <p>
            <span>
              <FiPhone />
            </span>{" "}
            {user.mobile || "No Mobile"}
          </p>
          <p>
            <span>
              <ImProfile />
            </span>{" "}
            {user.employeeId || "No ID"}
          </p>
        </div>
        <div className="table">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Emp Icod</th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={handleRedirectAttendance}
                >
                  Check in Time
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={handleRedirectAttendance}
                >
                  Check Time
                </th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.employeeId}</td>
                <td>{user.checkInTime}</td>
                <td>{user.checkTime}</td>
                <td>{user.duration}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
   
  );
}

export default Profile;
