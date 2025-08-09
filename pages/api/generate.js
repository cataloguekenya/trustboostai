import fetch from "node-fetch";

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

const systemPrompt = `
You are a skilled marketing copywriter who specializes in transforming plain customer reviews into persuasive, high-converting testimonials.
Follow tone and length instructions exactly. Keep content authentic but polished.
Never invent facts that are not in the original review.
`;

const userPromptTemplate = (review) => `
Transform the following customer review into three distinct marketing-ready testimonials:

1️⃣ Professional & Formal — Maintain a businesslike tone, perfect for corporate websites and proposals. Around 70–100 words.

2️⃣ Emotional Storytelling — Capture the emotional journey of the customer and the impact your product/service had. Around 100–130 words.

3️⃣ Short Punchy Social Media Post — Make it catchy, engaging, and under 25 words, suitable for Instagram/Twitter. Include one relevant emoji.

Here is the customer review:
"${review}"
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { review } = req.body;

  if (!review || review.trim().length < 10) {
    return res.status(400).json({ error: "Please provide a detailed review text." });
  }

  try {
    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-4-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPromptTemplate(review) },
        ],
        stream: false,
        temperature: 0.8,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Grok API error:", errorText);
      return res.status(response.status).json({ error: "Failed to generate testimonials." });
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    // Simple split into 3 testimonial parts
    const parts = text.split(/\n?\d[^\d]/).filter(Boolean);

    const professional = parts[0]?.trim() || "";
    const emotional = parts[1]?.trim() || "";
    const social = parts[2]?.trim() || "";

    res.status(200).json({ professional, emotional, social });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Server error generating testimonials." });
  }
}
