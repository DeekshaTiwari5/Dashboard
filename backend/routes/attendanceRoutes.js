const express = require('express');
const {
    checkIn,
    checkOut,
    getAttendance,
} = require('../controllers/attendanceController');
const { getUserInfo, updateProfile } = require("../controllers/profileController");
const authMiddleware = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');

const router = express.Router();

router.post('/checkin', authMiddleware, checkIn);
router.post('/checkout', authMiddleware, checkOut);
router.get("/me", authMiddleware, getUserInfo);  
router.post("/update-profile", authMiddleware, updateProfile);
router.get('/', authMiddleware, getAttendance);

// GET all attendance records for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const records = await Attendance.find({ userId: req.user.id })
            .populate("userId", "name _id employeeId")  
            .sort({ createdAt: -1 });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch attendance" });
    }
});
// routes/attendanceRoutes.js
router.get("/attendance", authMiddleware, async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user.id })
      .populate("userId", "name _id employeeId")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});


module.exports = router;
