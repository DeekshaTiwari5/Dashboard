const User = require('../models/User');

// Update Profile (Name, Mobile, Profile Image)
exports.updateProfile = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            mobile: req.body.mobile,
        };

        if (req.file) {
            updateData.profileImage = req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
