// src/services/embed.js (or utils/retrieval.js)

import FormSummary from "../models/FormSummary.js";

// Cosine similarity helper
function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function mag(a) {
  return Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
}

function cosineSim(a, b) {
  return dot(a, b) / (mag(a) * mag(b));
}

// MAIN: Retrieve top-K relevant forms using embeddings
export const retrieveRelevantForms = async ({ userId, queryEmbedding, topK = 5 }) => {
  const all = await FormSummary.find({ userId });

  if (!all.length) return [];

  const scored = all.map((doc) => ({
    id: doc.formId,
    score: cosineSim(queryEmbedding, doc.embedding),
    purpose: doc.purpose,
    summaryText: doc.summaryText,
    fields: doc.fields,
  }));

  // sort high → low
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
};

// Save summary for memory retrieval
export const upsertSummary = async ({ formId, userId, summaryText, fields, embedding }) => {
  await FormSummary.findOneAndUpdate(
    { formId },
    {
      formId,
      userId,
      purpose: summaryText.slice(0, 80),
      summaryText,
      fields,
      embedding,
    },
    { upsert: true }
  );
};
