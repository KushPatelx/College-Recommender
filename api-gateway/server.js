require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const jwt = require("jsonwebtoken");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const app = express();
const PORT = 5000;

// Security secret key
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_college_key";

app.use(
  cors({
    origin: "https://main.d1ox2kc9umbez3.amplifyapp.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json());

// DynamoDB Setup (For future Phase)
const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(client);

// S3 Client Setup
const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
});

// ==========================================
// Login Route (Authentication + S3 Logging)
// ==========================================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "abhay@student.com" && password === "password123") {
    const token = jwt.sign({ email: email, role: "student" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    try {
      const logData = {
        event: "USER_LOGIN",
        user: email,
        timestamp: new Date().toISOString(),
        status: "SUCCESS",
      };

      const command = new PutObjectCommand({
        Bucket: "abhay-college-logs-2026",
        Key: `login-logs/${email.split("@")[0]}-${Date.now()}.json`,
        Body: JSON.stringify(logData, null, 2),
        ContentType: "application/json",
      });

      s3Client
        .send(command)
        .then(() =>
          console.log(
            `✅ Login audit log successfully saved to S3 for ${email}`,
          ),
        )
        .catch((err) => console.error("❌ S3 Logging failed:", err));
    } catch (error) {
      console.error("S3 Setup Error:", error);
    }

    res.json({
      success: true,
      message: "Login successful!",
      token: token,
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Email ya Password galat hai" });
  }
});

// ==========================================
// JWT Middleware (Chowkidar)
// ==========================================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(403)
      .json({ error: "Access Denied! Bhai pehle login kar." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Invalid ya expired token! Wapas login kar." });
  }
};

// ==========================================
// Python Compute Engine Route (Proxy) - SECURED
// ==========================================
app.post("/api/recommend", verifyToken, async (req, res) => {
  try {
    console.log(
      "Valid Token found! Routing request to Python FastAPI Compute Engine...",
    );

    const pythonResponse = await fetch("http://127.0.0.1:8000/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await pythonResponse.json();
    res.json(data);
  } catch (error) {
    console.error("FastAPI Engine Error:", error);
    res
      .status(500)
      .json({ error: "Compute Engine is down or processing too long." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});
