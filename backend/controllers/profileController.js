const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const { name, mobile, employeeId } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (mobile) updateData.mobile = mobile;
        if (employeeId) updateData.employeeId = employeeId;
        if (req.file) updateData.profileImage = req.file.filename;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(400).json({ error: error.message });
    }
};
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        console.log("User Fetched:", user); 

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.findOne({
            userId: req.user.id,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        console.log("Today's Attendance Found:", attendance);  // ✅ Confirm attendance is fetched

        res.status(200).json({
            ...user.toObject(),
            attendance,
        });
    } catch (error) {
        console.error("Error in getUserInfo:", error);
        res.status(400).json({ error: error.message });
    }
};
