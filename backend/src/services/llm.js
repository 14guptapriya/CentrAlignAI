// backend/src/services/llm.js
import fetch from "node-fetch";

// Valid Gemini model
const GEMINI_MODEL = "gemini-2.5-flash";

// Form schema generator
export const generateFormSchema = async (prompt, context = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const formattedContext = JSON.stringify(context, null, 2);

  const finalPrompt = `
You are an intelligent JSON form schema generator.

Past form examples:
${formattedContext}

Now generate a JSON schema for this request:
"${prompt}"

Return ONLY valid JSON. No explanation.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: finalPrompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();
  const textRaw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  // REMOVE any ```json ... ``` wrapper
  const textClean = textRaw.replace(/```json|```/g, "").trim();

  return JSON.parse(textClean);
};
// Embedding generator
export const generateEmbedding = async (text) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/embedding-001",
          content: { parts: [{ text }] }
        })
      }
    );

    const data = await response.json();
    
    // Correct response format from Gemini API
    if (data.embedding && data.embedding.values) {
      return data.embedding.values;
    } else if (Array.isArray(data.embedding)) {
      return data.embedding;
    } else {
      console.warn("Unexpected embedding response:", data);
      return [];
    }
  } catch (err) {
    console.error("Embedding error:", err);
    return [];
  }
};



//console.log("Gemini API Key:", process.env.GEMINI_API_KEY ? "SET" : "NOT SET");
