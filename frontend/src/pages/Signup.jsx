import React, { useState } from "react";
import api from "../../src/services/api";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/signup", formData);
              navigate("/login");
            alert("Signup successful! Please verify your email.");
          
        } catch (err) {
            console.log(err.response?.data?.message);
            
            alert(err.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="page-container">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Sign up</button>
            </form>
            <p style={{ textAlign: "center", marginTop: "10px" }}>
                Already have an account? <span onClick={() => navigate("/login")} style={{ color: "#00b87c", cursor: "pointer" }}>Login</span>
            </p>
        </div>
    );
}

export default Signup;
