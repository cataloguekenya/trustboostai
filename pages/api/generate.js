// pages/api/generate.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_TWO,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ error: "Review is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates customer testimonials.",
        },
        {
          role: "user",
          content: `Generate a positive customer testimonial based on this review: "${review}"`,
        },
      ],
      max_tokens: 200,
    });

    res.status(200).json({
      testimonial: completion.choices[0].message.content.trim(),
    });

  } catch (error) {
    console.error("OpenAI API error:", error.message);

    // Friendly error messages
    if (error.status === 429) {
      return res.status(429).json({
        error: "We’ve hit the API usage limit. Please try again later or check your plan.",
      });
    }

    res.status(500).json({
      error: "Something went wrong while generating the testimonial. Please try again.",
    });
  }
}
