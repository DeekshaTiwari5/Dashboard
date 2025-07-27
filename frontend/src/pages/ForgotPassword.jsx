import React, { useState } from "react";
import api from "../../src/services/api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const sendOtp = async () => {
        try {
            await api.post("/auth/send-otp", { email });
            alert("OTP sent to your email");
            setStep(2);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to send OTP");
        }
    };

    const resetPassword = async () => {
        try {
            await api.post("/auth/reset-password", { email, otp, newPassword });
            alert("Password reset successful");
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="page-container">
            <h2>Forgot Password</h2>
            {step === 1 ? (
                <>
                <div className="form">
                     <input
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={sendOtp}>Send OTP</button>
                </div>
                   
                </>
            ) : (
                <>
                <div className="form">
  <input
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={resetPassword}>Reset Password</button>
                </div>
                  
                </>
            )}
        </div>
    );
}

export default ForgotPassword;
