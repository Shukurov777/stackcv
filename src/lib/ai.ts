import OpenAI from "openai";

export function getAiClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY не настроен в .env.local");
  return new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });
}

export const AI_MODEL = "deepseek-chat";
// Лимит токенов чтобы не тратить лишнее
export const MAX_TOKENS_GENERATE = 1200;
export const MAX_TOKENS_SCORE = 900;
