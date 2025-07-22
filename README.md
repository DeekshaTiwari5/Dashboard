# Employee Attendance Management System (MERN Stack)

A simple **Employee Attendance Management System** built with **ReactJS**, **Node.js (Express)**, and **MongoDB**. This application allows user authentication, profile management, and daily attendance tracking.

---

## 🚀 Features

### 🔐 Authentication
**Signup**: User registration with email verification.

**Login**:  
- Via **email and password**  
- Via **mobile number** with static OTP `123456`

### 👤 Profile Management
- Update profile information.
- Upload profile image.

### 📅 Attendance Management
- **Check-In / Check-Out**: Allowed once per day.
- Capture **check-in time**, **check-out time**, and **duration**.
- Dashboard displays user’s data and attendance history.
- Attendance table supports **search** and **pagination** (if records > 10).

---

## 🛠 Tech Stack

| Technology        | Purpose               |
|-------------------|-----------------------|
| ReactJS           | Frontend               |
| Node.js + Express | Backend API            |
| MongoDB           | Database               |
| GitHub            | Version Control / Deployment |

---

## 🗂️ MongoDB Schema


### **User Schema**
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profileImage: String,
    resetOtp: String,
    otpExpiry: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
```
## 📅 Attendance Schema (MongoDB - Mongoose)

```javascript
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: String },
    checkIn: { type: Date },
    checkOut: { type: Date },
    duration: { type: String },  
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

