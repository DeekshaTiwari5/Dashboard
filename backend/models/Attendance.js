const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: String },
    checkIn: { type: Date },
    checkOut: { type: Date },
    duration: { type: String },  
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
