const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');


// Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('✅ Created uploads/ directory');
}

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const profileRoutes = require('./routes/profileRoutes'); // ✅ Add this

const app = express();
app.use(cors({
    origin: 'https://dashboard-1-61ot.onrender.com', // e.g., 'https://your-react-app.onrender.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Or specify what you need
    credentials: true // If you're sending cookies/auth headers
}));

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/profile', profileRoutes); // ✅ Register profile routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
