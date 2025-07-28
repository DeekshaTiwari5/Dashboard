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
