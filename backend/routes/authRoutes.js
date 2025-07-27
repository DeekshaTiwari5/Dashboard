// const express = require('express');
// const { signup, verifyEmail, login, getUserInfo, sendOtpForPasswordReset, resetPassword } = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/signup', signup);
// router.get('/verify/:token', verifyEmail);
// router.post("/send-otp", sendOtpForPasswordReset);
// router.post("/reset-password", resetPassword);

// router.post('/login', login);
// router.get('/me', authMiddleware, getUserInfo);

// module.exports = router;
const express = require('express');
const {
  signup,
  verifyEmail,
  login,
  sendOtpForPasswordReset,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/send-otp', sendOtpForPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
