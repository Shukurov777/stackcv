"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StaggerIn } from "@/components/ui/AnimateIn";
import {
  Plus, FileText, Clock, Trash2, Pencil, Loader2, Sparkles,
} from "lucide-react";

interface ResumeRow {
  id: string;
  title: string;
  updatedAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/resumes")
      .then((r) => r.json())
      .then((data) => setResumes(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить резюме?")) return;
    setDeleting(id);
    await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    setResumes((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
        </div>
      </>
    );
  }

  if (status !== "authenticated") return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg)]">
        <div className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Личный кабинет</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--fg)]">Мои резюме</h1>
              <p className="mt-2 text-[var(--fg-muted)]">
                {session.user.name} · {resumes.length} {resumes.length === 1 ? "документ" : "документов"}
              </p>
            </motion.div>
            <Button href="/builder" size="md">
              <Plus className="h-4 w-4" />
              Новое резюме
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-10">
          {resumes.length === 0 ? (
            <Card padding="lg" className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                <FileText className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-[var(--fg)]">Пока нет резюме</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--fg-muted)]">
                Создайте первое ATS-ready резюме по HR-стандартам — займёт около 5 минут.
              </p>
              <Button href="/builder" className="mt-6">
                <Plus className="h-4 w-4" />
                Создать резюме
              </Button>
            </Card>
          ) : (
            <StaggerIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
              <motion.div variants={cardVariants}>
                <Link
                  href="/builder"
                  className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-elevated)] text-center transition hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]"
                >
                  <Plus className="h-8 w-8 text-[var(--fg-faint)]" />
                  <p className="mt-3 text-sm font-semibold text-[var(--fg-muted)]">Новое резюме</p>
                </Link>
              </motion.div>

              {resumes.map((resume) => (
                <motion.div key={resume.id} variants={cardVariants} whileHover={{ y: -2 }}>
                  <Card padding="md" hover className="h-full flex flex-col">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 flex-1 font-semibold text-[var(--fg)] truncate">{resume.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--fg-faint)]">
                      <Clock className="h-3 w-3" />
                      {formatDate(resume.updatedAt)}
                    </p>
                    <div className="mt-5 flex gap-2">
                      <Button href={`/builder/${resume.id}`} variant="secondary" size="sm" className="flex-1">
                        <Pencil className="h-3.5 w-3.5" />
                        Редактировать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        loading={deleting === resume.id}
                        onClick={() => handleDelete(resume.id)}
                      >
                        {!deleting && <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </StaggerIn>
          )}
        </div>
      </main>
    </>
  );
}
