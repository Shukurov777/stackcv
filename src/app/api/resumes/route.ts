import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json(resumes);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const schema = z.object({
      title: z.string().min(1).default("Моё резюме"),
      data: z.string(),
    });

    const { title, data } = schema.parse(body);

    const resume = await prisma.resume.create({
      data: { userId: session.user.id, title, data },
    });

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error("Create resume error:", error);
    return NextResponse.json({ error: "Ошибка создания резюме" }, { status: 500 });
  }
}
