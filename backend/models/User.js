const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    employeeId: { type: String, required: true, unique: true ,default: "415469" },

    profileImage: String,
    resetOtp: String,
otpExpiry: Date,

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
