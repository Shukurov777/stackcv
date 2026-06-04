import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

async function getResume(id: string, userId: string) {
  return prisma.resume.findFirst({ where: { id, userId } });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { id } = await params;
  const resume = await getResume(id, session.user.id);
  if (!resume) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  return NextResponse.json(resume);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { id } = await params;
  const existing = await getResume(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  try {
    const body = await request.json();
    const schema = z.object({
      title: z.string().min(1).optional(),
      data: z.string().optional(),
    });

    const payload = schema.parse(body);

    const updated = await prisma.resume.update({
      where: { id },
      data: { ...payload, updatedAt: new Date() },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update resume error:", error);
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { id } = await params;
  const existing = await getResume(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  await prisma.resume.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
