import mongoose from "mongoose";
import FormSummary from "./models/FormSummary.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

async function testModel() {
  try {
    const doc = await FormSummary.create({
      formId: "test1",
      userId: "user123",
      purpose: "Test purpose",
      summaryText: "This is a test summary",
      fields: ["name", "email"],
      embedding: [0.1, 0.2, 0.3]
    });
    console.log("Document saved:", doc);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

testModel();
