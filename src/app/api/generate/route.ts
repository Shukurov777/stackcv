import { NextResponse } from "next/server";
import { z } from "zod";
import { getAiClient, AI_MODEL, MAX_TOKENS_GENERATE } from "@/lib/ai";

const schema = z.object({
  fullName: z.string(),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    city: z.string(),
    linkedin: z.string().optional(),
    telegram: z.string().optional(),
  }),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      isCurrent: z.boolean().optional(),
      description: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string().optional(),
      startDate: z.string(),
      endDate: z.string(),
    }),
  ),
  skills: z.string(),
  languages: z
    .array(z.object({ language: z.string(), level: z.string() }))
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const client = getAiClient();

    const prompt = `Ты опытный HR-консультант. На основе данных кандидата создай профессиональный текст резюме на русском языке по ATS-стандартам.

ПРАВИЛА (строго):
1. Summary: 2-3 предложения, конкретно, без клише
2. Для каждого опыта: 3-4 bullet points, начиная с глагола действия, цифры где возможно
3. Навыки: 8-12 релевантных через запятую
4. БЕЗ воды, БЕЗ "ответственный и целеустремлённый"
5. Ответ ТОЛЬКО JSON, без markdown

JSON:
{"summary":"строка","experience":[{"id":"строка","bullets":["строка"]}],"skills":["строка"]}

Данные:
${JSON.stringify(data, null, 2)}`;

    const res = await client.chat.completions.create({
      model: AI_MODEL,
      max_tokens: MAX_TOKENS_GENERATE,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (res.choices[0]?.message?.content ?? "").trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Некорректный ответ ИИ");

    return NextResponse.json(JSON.parse(match[0]));
  } catch (error) {
    console.error("Generate error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
    }
    const msg = error instanceof Error ? error.message : "Ошибка генерации";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
