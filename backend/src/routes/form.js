import mongoose from "mongoose";
import express from "express";
import Form from "../models/Form.js";
import { retrieveRelevantForms } from "../utils/retrieval.js";
import { generateFormSchema, generateEmbedding } from "../services/llm.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    // 1. Retrieve relevant form memory
    const context = await retrieveRelevantForms(prompt);

    // 2. Generate schema
    const schema = await generateFormSchema(prompt, context);

    // 3. create form (NO EMBEDDING HERE)
    const newForm = await Form.create({
      userId,
      prompt,
      schema,
      createdAt: new Date()
    });

    res.json({ success: true, form: newForm });

  } catch (err) {
    console.error("Form generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
