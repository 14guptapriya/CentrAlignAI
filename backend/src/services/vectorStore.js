// backend/src/services/vectorStore.js
// Wrapper that uses Pinecone if configured, else falls back to storing embeddings in Mongo (FormSummary.embeddings)

const FormSummary = require('../models/FormSummary');

let pineconeClient = null;
let pineconeIndex = null;

if (process.env.PINECONE_API_KEY) {
  const { PineconeClient } = require('@pinecone-database/pinecone');
  pineconeClient = new PineconeClient();
  (async () => {
    await pineconeClient.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX);
    console.log('Pinecone initialized');
  })().catch(err => {
    console.error('Error initializing Pinecone:', err);
    pineconeClient = null;
  });
}

/**
 * Upsert a form summary embedding to Pinecone (if configured) or to Mongo fallback.
 * - formId: ObjectId or string
 * - userId: user id string
 * - summaryText: short summary
 * - fields: array of field names
 * - embedding: array of numbers
 */
async function upsertSummary({ formId, userId, summaryText, fields, embedding }) {
  if (pineconeClient && pineconeIndex) {
    const vectors = [{
      id: formId.toString(),
      values: embedding,
      metadata: {
        purpose: summaryText.slice(0, 100),
        fields,
        summaryText,
      }
    }];

    await pineconeIndex.upsert({
      upsertRequest: {
        vectors,
        namespace: userId.toString()
      }
    });
    return;
  }

  // Fallback: store embedding in a FormSummary document
  await FormSummary.findOneAndUpdate(
    { formId },
    {
      formId,
      userId,
      purpose: summaryText.slice(0, 80),
      summaryText,
      fields,
      embedding
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

/**
 * Query top K similar form summaries for a user's namespace.
 * - userId: string
 * - queryEmbedding: array<number>
 * - topK: number
 *
 * Returns array of { id, score, metadata }
 */
async function queryTopK({ userId, queryEmbedding, topK = 5 }) {
  if (pineconeClient && pineconeIndex) {
    // Pinecone query
    const q = await pineconeIndex.query({
      queryRequest: {
        topK,
        vector: queryEmbedding,
        namespace: userId.toString(),
        includeMetadata: true
      }
    });

    if (!q || !q.matches) return [];

    return q.matches.map(m => ({
      id: m.id,
      score: m.score,
      metadata: m.metadata
    }));
  }

  // Fallback: naive cosine similarity search on embeddings stored in MongoDB
  // Retrieve candidates for the user (optionally limit retrieval to N docs to avoid huge memory)
  const candidates = await FormSummary.find({ userId }, { embedding: 1, summaryText: 1, fields: 1, purpose: 1, formId: 1 }).lean();

  if (!candidates || candidates.length === 0) return [];

  // helper functions
  const dot = (a, b) => {
    let s = 0;
    for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i];
    return s;
  };

  const norm = (a) => Math.sqrt(a.reduce((s, v) => s + v * v, 0) || 0.000001);

  const qnorm = norm(queryEmbedding);

  const scored = candidates.map(doc => {
    if (!doc.embedding || doc.embedding.length === 0) return { doc, score: -1 };
    const score = dot(queryEmbedding, doc.embedding) / (qnorm * norm(doc.embedding));
    return { doc, score: Number.isFinite(score) ? score : -1 };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, topK).map(s => ({
    id: s.doc.formId ? s.doc.formId.toString() : (s.doc._id ? s.doc._id.toString() : null),
    score: s.score,
    metadata: {
      summaryText: s.doc.summaryText,
      fields: s.doc.fields,
      purpose: s.doc.purpose
    }
  }));

  return top;
}

module.exports = { upsertSummary, queryTopK };
