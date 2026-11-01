// backend/src/models/Submission.js
import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  formId: String,
  responses: Object,
  createdAt: Date,
});

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
