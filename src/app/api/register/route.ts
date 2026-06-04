import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = schema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже зарегистрирован" },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: hashed },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues ?? [];
      return NextResponse.json({ error: issues[0]?.message ?? "Ошибка валидации" }, { status: 400 });
    }
    console.error("Register error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
