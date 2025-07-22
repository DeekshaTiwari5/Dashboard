import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Attendance from "./pages/Attendance";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Signup/>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/verify/:token" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />


            </Routes>
        </Router>
    );
}

export default App;
