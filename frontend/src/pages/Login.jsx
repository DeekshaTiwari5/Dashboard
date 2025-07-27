import React, { useState } from "react";
import api from "../../src/services/api";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    console.log("Login payload:", { email, password });

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("Login response:", res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        alert(error.response.data.message || "Login failed");
      } else {
        alert("Network error");
      }
    }
  };

  return (
    <div className="page-container">
      <h2>Login</h2>
      <div className="form">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Log in</button>

  
      </div>
            <p style={{ textAlign: "right", marginTop: "10px" ,marginRight:" 40px" }}>
          <span
            onClick={() => navigate("/forgot-password")}
            style={{ color: "#00b87c", cursor: "pointer" }}
          >
            Forgot Password?
          </span>
        </p>
    </div>
  );
}

export default Login;
