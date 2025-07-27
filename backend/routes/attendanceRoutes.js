
const express = require('express');
const {
  checkIn,
  checkOut,
  getAllAttendance,
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');

const router = express.Router();

router.post('/checkin', authMiddleware, checkIn);
router.post('/checkout', authMiddleware, checkOut);

// Get latest attendance with user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

// Get all records
router.get('/', authMiddleware, getAllAttendance);

module.exports = router;
