import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Header } from "@/components/Header";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { normalizeResumeData } from "@/lib/normalize-resume";
import type { ResumeData } from "@/types/resume";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditResumePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!resume) redirect("/dashboard");

  let parsed: ResumeData | undefined;
  try {
    parsed = normalizeResumeData(JSON.parse(resume.data) as ResumeData);
  } catch {
    redirect("/dashboard");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg)] pb-16">
        <ResumeBuilder
          resumeId={resume.id}
          initialData={parsed}
          initialTitle={resume.title}
        />
      </main>
    </>
  );
}
