const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

// Nodemailer Email Send
    const sendVerificationMail = async (email, userId) => {
     const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    //  const url = `${process.env.FRONTEND_BASE_URL}/verify/${token}`;
     const url = `${process.env.FRONTEND_BASE_URL}`;


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    console.log(' to send email to:', email);

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: `<h4>Verify your email</h4><p><a href="${url}">${url}</a></p>`,
        });
        console.log('Verification email sent successfully to:', email);
    } catch (err) {
        console.error('Failed to send email:', err);
    }
};

// Generates a unique 6-digit employee ID
const generateEmployeeId = async () => {
  let unique = false;
  let id;

  while (!unique) {
    id = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    const existing = await User.findOne({ employeeId: id });
    if (!existing) unique = true;
  }

  return id;
};
// Signup
exports.signup = async (req, res) => {
    try {
        console.log('Signup Request Body:', req.body);
        const { name, email, mobile, password } = req.body;

        // ✅ Await the async function
        const employeeId = await generateEmployeeId();

        if (!name || !email || !mobile || !password || !employeeId) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            employeeId,
            isVerified: false,
        });

        await user.save();
        await sendVerificationMail(email, user._id);

        res.status(200).json({ message: 'Signup successful. Please verify your email.' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Email Verification
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.isVerified = true; // ✅ Mark user as verified
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Invalid or expired token" });
    }
};

// Login (Email/Password or Mobile/Static OTP)
exports.login = async (req, res) => {
    try {
        const { email, password, mobile, otp } = req.body;

        if (otp && mobile) {
            if (otp !== '123456') {
                return res.status(400).json({ message: 'Invalid OTP' });
            }
            const user = await User.findOne({ mobile });
            if (!user || !user.isVerified) {
                return res.status(400).json({ message: 'User not found or not verified' });
            }
            const token = jwt.sign({ id: user._id }, JWT_SECRET);
            return res.status(200).json({ token, user });
        }

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user || !user.isVerified) {
            return res.status(400).json({ message: 'User not found or not verified' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.sendOtpForPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    await user.save();

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password OTP',
        html: `<h4>Your OTP: ${otp}</h4>`,
    });

    res.status(200).json({ message: 'OTP sent to email' });
};
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, mobile } = req.body;
        let profileImage = req.file ? req.file.filename : undefined;

        const updateFields = { name, mobile };
        if (profileImage) updateFields.profileImage = profileImage;

        await User.findByIdAndUpdate(userId, updateFields);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// // Get User Info for Dashboard
// exports.getUserInfo = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select('-password');
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

