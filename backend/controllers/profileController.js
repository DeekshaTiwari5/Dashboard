const Attendance = require("../models/Attendance");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (mobile) updateData.mobile = mobile;
    if (req.file) updateData.profileImage = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Register user controller
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const employeeId = await generateUniqueEmployeeId();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      employeeId, 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: {
    name: newUser.name,
    email: newUser.email,
    employeeId: newUser.employeeId
  } });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const attendance = await Attendance.findOne({ userId: user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      profileImage: user.profileImage,
      employeeId: user.employeeId,
      attendance: attendance || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user info" });
  }
};


exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.filename },
      { new: true, select: "-password" }
    );

    res.status(200).json({
      message: "Profile image uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    res.status(500).json({ error: error.message });
  }
};
