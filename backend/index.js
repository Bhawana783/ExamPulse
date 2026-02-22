import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import ExamRoutes from "./src/routes/examRoutes.js";
import StudentRoutes from "./src/routes/studentRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/exams", ExamRoutes);
app.use("/api/students", StudentRoutes);

app.get("/", (req, res) => res.send("ExamPulse API Running"));

app.listen(5000, () => console.log("Server running on port 5000"));

export default app;
