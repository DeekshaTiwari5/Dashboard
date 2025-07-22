const express = require('express');
const {
    checkIn,
    checkOut,
    getAttendance,
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkin', authMiddleware, checkIn);
router.post('/checkout', authMiddleware, checkOut);
router.get('/', authMiddleware, getAttendance);

module.exports = router;
