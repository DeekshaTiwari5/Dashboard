const express = require('express');
const { updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/multer'); 

const router = express.Router();


router.put('/update', authMiddleware, upload.single('profileImage'), updateProfile);

module.exports = router;
