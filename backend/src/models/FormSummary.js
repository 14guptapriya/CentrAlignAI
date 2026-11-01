import mongoose from "mongoose";

const FormSummarySchema = new mongoose.Schema(
  {
    formId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    purpose: { type: String },
    summaryText: { type: String },
    fields: { type: [String], default: () => [] },

    // FIXED VERSION
    embedding: { type: [Number], default: () => [] },
  },
  { timestamps: true }
);

export default mongoose.models.FormSummary ||
  mongoose.model("FormSummary", FormSummarySchema);
