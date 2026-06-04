"use client";

import { useState } from "react";
import {
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import type { ResumeData } from "@/types/resume";
import { cn } from "@/lib/utils";
import { AnimateIn, StaggerIn } from "@/components/ui/AnimateIn";

interface ScoreResult {
  overall: number;
  sections: {
    contact: number;
    summary: number;
    experience: number;
    skills: number;
  };
  verdict: string;
  strengths: string[];
  improvements: Array<{ priority: "высокий" | "средний" | "низкий"; text: string }>;
}

const PRIORITY_CONFIG = {
  высокий: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/40", label: "Важно" },
  средний: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/40", label: "Желательно" },
  низкий:  { color: "text-blue-600 dark:text-blue-400",  bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/40",  label: "Опционально" },
};

function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-[var(--bg-muted)]" />
      <circle
        cx="50" cy="50" r={r}
        fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

function SectionBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-themed-muted">{label}</span>
        <span className="font-semibold text-themed">{score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-muted)]">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

interface Props {
  resumeData: ResumeData;
}

export function ScorePanel({ resumeData }: Props) {
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка оценки");
      setScore(data);
      setOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
      <button
        type="button"
        onClick={score ? () => setOpen((v) => !v) : handleScore}
        disabled={loading}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[var(--bg-subtle)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--fg)]">
              {score ? `Оценка: ${score.overall}/100` : "Оценить резюме с ИИ"}
            </p>
            <p className="text-xs text-[var(--fg-faint)]">
              {score ? "Анализ по HR-стандартам" : "Выявит слабые места до отправки"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-[var(--accent)]" />}
          {!loading && score && (open ? <ChevronUp className="h-4 w-4 text-[var(--fg-faint)]" /> : <ChevronDown className="h-4 w-4 text-[var(--fg-faint)]" />)}
          {!loading && !score && (
            <span className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white">Оценить</span>
          )}
        </div>
      </button>

      {error && (
        <div className="border-t border-themed px-5 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {score && open && (
        <div className="border-t border-themed px-5 py-5 space-y-5">
          <AnimateIn variant="scale" duration={0.4}>
            {/* Overall score */}
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <ScoreRing score={score.overall} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-themed">{score.overall}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-themed">Общий балл</p>
                <p className="mt-1 text-sm leading-relaxed text-themed-muted">{score.verdict}</p>
              </div>
            </div>
          </AnimateIn>

          {/* Section bars */}
          <AnimateIn delay={0.1} duration={0.4}>
            <div className="space-y-3">
              <SectionBar label="Контакты" score={score.sections.contact} />
              <SectionBar label="О себе" score={score.sections.summary} />
              <SectionBar label="Опыт" score={score.sections.experience} />
              <SectionBar label="Навыки" score={score.sections.skills} />
            </div>
          </AnimateIn>

          {/* Strengths */}
          {score.strengths?.length > 0 && (
            <AnimateIn delay={0.2} duration={0.4}>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Сильные стороны
                </p>
                <StaggerIn className="space-y-1.5" stagger={0.08}>
                  {score.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-themed-muted">
                      <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                      {s}
                    </div>
                  ))}
                </StaggerIn>
              </div>
            </AnimateIn>
          )}

          {/* Improvements */}
          {score.improvements?.length > 0 && (
            <AnimateIn delay={0.3} duration={0.4}>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Что улучшить
                </p>
                <div className="space-y-2">
                  {score.improvements.map((item, i) => {
                    const cfg = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG["низкий"];
                    return (
                      <div
                        key={i}
                        className={cn("flex items-start gap-2.5 rounded-xl border p-3 text-sm", cfg.bg)}
                      >
                        <AlertCircle className={cn("mt-0.5 h-4 w-4 flex-shrink-0", cfg.color)} />
                        <div>
                          <span className={cn("mr-1.5 text-xs font-bold uppercase", cfg.color)}>
                            {cfg.label}
                          </span>
                          <span className="text-themed">{item.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimateIn>
          )}

          <button
            onClick={handleScore}
            disabled={loading}
            className="w-full rounded-xl border border-[var(--border)] py-2.5 text-xs font-semibold text-[var(--fg-muted)] transition hover:bg-[var(--bg-subtle)] disabled:opacity-50"
          >
            {loading ? "Обновляем оценку..." : "Оценить повторно"}
          </button>
        </div>
      )}
    </div>
  );
}
