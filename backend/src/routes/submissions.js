import express from "express";
import Submission from "../models/Submission.js";

const router = express.Router();

router.post("/:formId", async (req, res) => {
  const { formId } = req.params;
  const responses = req.body;

  const sub = await Submission.create({
    formId,
    responses,
    createdAt: new Date(),
  });

  res.json({ success: true, submission: sub });
});

export default router;
