import { NextResponse } from "next/server";
import { getAiClient, AI_MODEL, MAX_TOKENS_SCORE } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = getAiClient();

    const prompt = `Ты строгий HR-менеджер с 15-летним опытом. Оцени резюме кандидата.

Верни ТОЛЬКО JSON без markdown:
{
  "overall": число 0-100,
  "sections": {
    "contact": число 0-100,
    "summary": число 0-100,
    "experience": число 0-100,
    "skills": число 0-100
  },
  "verdict": "1-2 предложения общего вывода",
  "strengths": ["сильная сторона 1", "сильная сторона 2"],
  "improvements": [
    {"priority": "высокий", "text": "что улучшить"},
    {"priority": "средний", "text": "что улучшить"}
  ]
}

Резюме для оценки:
Имя: ${body.contact?.fullName || "Не указано"}
Email: ${body.contact?.email || "Не указан"}
Телефон: ${body.contact?.phone || "Не указан"}
Город: ${body.contact?.city || "Не указан"}
О себе: ${body.summary || "Не заполнено"}
Опыт: ${JSON.stringify(body.experience || [])}
Образование: ${JSON.stringify(body.education || [])}
Навыки: ${body.skills || "Не указаны"}`;

    const res = await client.chat.completions.create({
      model: AI_MODEL,
      max_tokens: MAX_TOKENS_SCORE,
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (res.choices[0]?.message?.content ?? "").trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Некорректный ответ ИИ");

    return NextResponse.json(JSON.parse(match[0]));
  } catch (error) {
    console.error("Score error:", error);
    const msg = error instanceof Error ? error.message : "Ошибка оценки";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
