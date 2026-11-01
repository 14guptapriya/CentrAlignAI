import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import formRoutes from "./routes/form.js";
import submissionRoutes from "./routes/submissions.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/forms", formRoutes);
app.use("/submit", submissionRoutes);
app.use("/upload", uploadRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

//console.log("Gemini API Key:", process.env.GEMINI_API_KEY ? "SET" : "NOT SET");
console.log("MongoDB URI:", process.env.MONGO_URI ? "SET" : "NOT SET");