const Attendance = require("../models/Attendance");

// 📥 Check In API
exports.checkIn = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you use auth middleware to set req.user
        const today = new Date().toISOString().split('T')[0];

        let attendance = await Attendance.findOne({ userId, date: today });
        if (attendance && attendance.checkIn) {
            return res.status(400).json({ message: "Already checked in today." });
        }

        if (!attendance) {
            attendance = new Attendance({
                userId,
                date: today,
                checkIn: new Date(),
            });
        } else {
            attendance.checkIn = new Date();
        }

        await attendance.save();
        res.status(200).json({ message: "Checked in successfully.", attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 📤 Check Out API
exports.checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({ userId, date: today });
        if (!attendance || !attendance.checkIn) {
            return res.status(400).json({ message: "Check-in required before check-out." });
        }

        attendance.checkOut = new Date();

        // Calculate duration
        const durationMs = new Date(attendance.checkOut) - new Date(attendance.checkIn);
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        attendance.duration = `${hours} hours ${minutes} minutes`;

        await attendance.save();
        res.status(200).json({ message: "Checked out successfully.", attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 📄 Get All Attendance Records
exports.getAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendanceRecords = await Attendance.find({ userId }).sort({ date: -1 });
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
