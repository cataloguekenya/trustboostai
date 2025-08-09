import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPromptTemplate(review) },
      ],
      max_tokens: 600,
      temperature: 0.8,
    });

    const text = completion.data.choices[0].message.content;

    // The output will contain 3 testimonials, separated by numbering. Let's split them.
    // This is a simple approach assuming numbering format "1. ... 2. ... 3. ..."
    const splitByNumber = text.split(/\n?\d[^\d]/).filter(Boolean);

    // Sometimes GPT returns in different formats; fallback parsing
    let professional = "", emotional = "", social = "";
    if (splitByNumber.length >= 3) {
      professional = splitByNumber[0].trim();
      emotional = splitByNumber[1].trim();
      social = splitByNumber[2].trim();
    } else {
      // fallback: just split by new lines and assign
      const lines = text.split("\n").filter(Boolean);
      professional = lines[0] || "";
      emotional = lines[1] || "";
      social = lines[2] || "";
    }

    res.status(200).json({ professional, emotional, social });
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate testimonials." });
  }
}
