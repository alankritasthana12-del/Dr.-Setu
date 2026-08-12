import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getGeminiModel = () => {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    maxOutputTokens: 2048,
    apiKey: process.env.GEMINI_API_KEY,
  });
};
