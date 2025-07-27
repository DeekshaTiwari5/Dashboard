const express = require('express');
const { updateProfile, getUserInfo, uploadAvatar } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/multer'); 

const router = express.Router();
console.log({ updateProfile, getUserInfo, uploadAvatar });

router.get('/me', authMiddleware, getUserInfo);
router.put('/update', authMiddleware, updateProfile);
// upload profile image
router.post('/upload-avatar', authMiddleware, upload.single('profileImage'), uploadAvatar);

module.exports = router;
