import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import ExamRoutes from "./src/routes/examRoutes.js";
import StudentRoutes from "./src/routes/studentRoutes.js";
import AuthRoutes from "./src/routes/authRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

mongoose.set("bufferCommands", false);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ Missing MongoDB connection string. Set MONGO_URI in backend/.env");
}

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB Connected");
});

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB Error:", error.message);
});

app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database is not connected. Please verify MongoDB is running and MONGO_URI is correct.",
    });
  }
  return next();
});

app.use("/api/auth", AuthRoutes);
app.use("/api/exams", ExamRoutes);
app.use("/api/students", StudentRoutes);

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "ExamPulse API Running",
    version: "v1",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Unexpected server error",
  });
});

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    if (!mongoUri) {
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
