import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await axios.get(`https://dashboard-4cy7.onrender.com/api/auth/verify/${token}`);
                alert("✅ Email verified successfully!");
                navigate("/login");
            } catch (error) {
                console.error(error.response?.data);
                alert(error.response?.data?.error || "❌ Verification failed");
            }
        };
        verifyEmail();
    }, [token, navigate]);

    return <h2>Verifying email...</h2>;
}

export default VerifyEmail;
