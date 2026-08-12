import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getGeminiModel = () => {
  return new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-pro",
    maxOutputTokens: 2048,
    apiKey: process.env.GEMINI_API_KEY,
  });
};
