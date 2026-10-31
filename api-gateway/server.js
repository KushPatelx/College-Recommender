require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_college_key";

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// MONGODB CONNECTION
mongoose.connect('mongodb+srv://abhay_panchal:1234@cluster0.ois4m98.mongodb.net/collegeDB')
    .then(() => console.log('✅ MongoDB Connected to collegeDB'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// SCHEMAS
const collegeSchema = new mongoose.Schema({
    College_Name: String, Branch_Name: String, College_Tier: String,
    City_Name: String, City_Tier: String, Course_Domain: String,
    Fee_OPEN: Number, Fee_OBC: Number, Fee_SC: Number, Fee_ST: Number, Fee_VJNT: Number,
    Base_Tuition_Fee: Number, Institute_Type: String, Minority_Status: String,
    Current_Avg_Package: Number, Current_Highest_Package: Number, Top_Recruiters: String
}, { collection: 'colleges' });
const College = mongoose.model('College', collegeSchema);

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'student' }
}, { discriminatorKey: 'userType' });
const User = mongoose.model('User', userSchema);

const Student = User.discriminator('Student', new mongoose.Schema({
    percentile: Number,
    branchPreference: [String],
    budget: Number
}));

// API ROUTES
app.post("/api/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent = new Student({ email, passwordHash: hashedPassword });
        await newStudent.save();
        res.json({ success: true, message: "Student registered successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Registration failed." });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax", 
            maxAge: 3600000
        });

        res.json({ success: true, message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login failed" });
    }
});

// NAYA ROUTE: Proper Backend Logout
app.post("/api/logout", (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.json({ success: true, message: "Logged out successfully" });
});

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(403).json({ error: "Access Denied! No token provided." });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token!" });
    }
};

app.get('/api/top-colleges', async (req, res) => {
    try {
        const colleges = await College.find({}).limit(50);
        res.json({ success: true, data: colleges });
    } catch (error) {
        res.status(500).json({ success: false, error: "Database error" });
    }
});

app.post("/api/recommend", verifyToken, async (req, res) => {
  try {
    const pythonResponse = await fetch("http://127.0.0.1:8000/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await pythonResponse.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Compute Engine is down." });
  }
});

app.listen(PORT, () => console.log(`🚀 API Gateway running on http://localhost:${PORT}`));