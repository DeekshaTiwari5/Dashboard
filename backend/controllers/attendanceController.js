const Attendance = require("../models/Attendance");

// 📥 Check In API
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    // Check if user already checked in today
    const existing = await Attendance.findOne({ userId, date: today });

    if (existing && existing.checkIn) {
      return res
        .status(400)
        .json({ message: "You have already checked in today." });
    }

    if (existing) {
      existing.checkIn = new Date();
      await existing.save();
      return res
        .status(200)
        .json({ message: "Checked in successfully", data: existing });
    }

    const newAttendance = new Attendance({
      userId,
      date: today,
      checkIn: new Date(),
    });

    await newAttendance.save();
    return res
      .status(200)
      .json({ message: "Checked in successfully", data: newAttendance });
  } catch (error) {
    res.status(500).json({ message: "Check-in failed", error });
  }
};

// 📤 Check Out API
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const existing = await Attendance.findOne({ userId, date: today });

    if (!existing || !existing.checkIn) {
      return res.status(400).json({ message: "You haven't checked in yet." });
    }

    if (existing.checkOut) {
      return res
        .status(400)
        .json({ message: "You have already checked out today." });
    }

    existing.checkOut = new Date();
    await existing.save();

    res
      .status(200)
      .json({ message: "Checked out successfully", data: existing });
  } catch (error) {
    res.status(500).json({ message: "Check-out failed", error });
  }
};

// 📄 Get all attendance records with user name and employeeId
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate(
      "userId",
      "name employeeId"
    ); // populate only required fields
    res.status(200).json(attendance);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch attendance", error: err.message });
  }
};
