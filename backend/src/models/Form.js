import mongoose from "mongoose";

const FormSchema = new mongoose.Schema(
  {
    userId: String,
    prompt: String,
    schema: Object,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Form || mongoose.model("Form", FormSchema);