"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Save,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FileText,
  Eye,
  Palette,
} from "lucide-react";
import type { GeneratedContent, ResumeData, TemplateId } from "@/types/resume";
import { createEmptyResume, createId, cn } from "@/lib/utils";
import { normalizeResumeData } from "@/lib/normalize-resume";
import { exportResumeToPdf, resumePdfFilename } from "@/lib/export-pdf";
import { ResumePreview } from "@/components/ResumePreview";
import { ScorePanel } from "@/components/ScorePanel";
import { DesignPanel } from "@/components/design/DesignPanel";
import { ExampleGallery } from "@/components/design/ExampleGallery";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const STORAGE_KEY = "stackcv-builder-v2";

const TEMPLATES: { id: TemplateId; label: string; desc: string }[] = [
  { id: "modern", label: "Modern", desc: "Профессиональный двухколоночный HR-формат" },
  { id: "classic", label: "Classic", desc: "Executive — банки, госсектор, консервативные компании" },
  { id: "minimal", label: "Minimal", desc: "ATS-оптимизированный для IT и продуктовых команд" },
];

const STEPS = [
  { id: "design", label: "Дизайн", icon: Palette },
  { id: "contact", label: "Контакты", icon: User },
  { id: "experience", label: "Опыт", icon: Briefcase },
  { id: "education", label: "Образование", icon: GraduationCap },
  { id: "skills", label: "Навыки", icon: Wrench },
  { id: "summary", label: "О себе", icon: FileText },
];

// ── reusable field components ─────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg)]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field-input w-full"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg)]">{label}</span>
      {hint && <p className="mb-1.5 text-xs text-[var(--fg-faint)]">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="field-input w-full resize-y min-h-[100px]"
      />
    </label>
  );
}

// ── step panels ───────────────────────────────────────────────────────────────
function ContactStep({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const upd = (field: keyof ResumeData["contact"], val: string) =>
    onChange({ ...data, contact: { ...data.contact, [field]: val } });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="ФИО" value={data.contact.fullName} onChange={(v) => upd("fullName", v)} placeholder="Иван Петров" required />
      </div>
      <Field label="Email" type="email" value={data.contact.email} onChange={(v) => upd("email", v)} placeholder="ivan@example.com" required />
      <Field label="Телефон" value={data.contact.phone} onChange={(v) => upd("phone", v)} placeholder="+7 999 123-45-67" />
      <Field label="Город" value={data.contact.city} onChange={(v) => upd("city", v)} placeholder="Москва" />
      <Field label="LinkedIn" value={data.contact.linkedin} onChange={(v) => upd("linkedin", v)} placeholder="linkedin.com/in/username" />
      <Field label="Telegram" value={data.contact.telegram} onChange={(v) => upd("telegram", v)} placeholder="@username" />
      <Field label="Сайт / Портфолио" value={data.contact.website} onChange={(v) => upd("website", v)} placeholder="mysite.ru" />
    </div>
  );
}

function ExperienceStep({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const addItem = () =>
    onChange({
      ...data,
      experience: [
        ...data.experience,
        { id: createId(), company: "", position: "", startDate: "", endDate: "", isCurrent: false, description: "" },
      ],
    });

  const removeItem = (id: string) =>
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) });

  const updItem = (id: string, field: string, val: string | boolean) =>
    onChange({
      ...data,
      experience: data.experience.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });

  return (
    <div className="space-y-6">
      {data.experience.map((item, idx) => (
        <div key={item.id} className="form-block">
          <div className="mb-4 flex items-center justify-between">
            <span className="form-block-title">Место работы {idx + 1}</span>
            {data.experience.length > 1 && (
              <button type="button" onClick={() => removeItem(item.id)} className="form-delete-btn">
                <Trash2 className="h-3.5 w-3.5" />
                Удалить
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Должность" value={item.position} onChange={(v) => updItem(item.id, "position", v)} placeholder="Frontend Developer" />
            <Field label="Компания" value={item.company} onChange={(v) => updItem(item.id, "company", v)} placeholder="ООО Яндекс" />
            <Field label="Дата начала" value={item.startDate} onChange={(v) => updItem(item.id, "startDate", v)} placeholder="Янв 2022" />
            <div>
              <Field
                label="Дата окончания"
                value={item.endDate}
                onChange={(v) => updItem(item.id, "endDate", v)}
                placeholder={item.isCurrent ? "По настоящее время" : "Дек 2023"}
              />
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[var(--fg-muted)]">
                <input
                  type="checkbox"
                  checked={item.isCurrent}
                  onChange={(e) => updItem(item.id, "isCurrent", e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border-strong)] accent-[var(--accent)]"
                />
                По настоящее время
              </label>
            </div>
          </div>
          <div className="mt-3">
            <Textarea
              label="Обязанности и достижения"
              value={item.description}
              onChange={(v) => updItem(item.id, "description", v)}
              placeholder="Каждый пункт с новой строки. ИИ превратит их в профессиональные bullet points."
              rows={5}
              hint="Напишите что вы делали и каких результатов достигли — ИИ улучшит формулировки."
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={addItem} className="form-add-btn">
        <Plus className="h-4 w-4" />
        Добавить место работы
      </button>
    </div>
  );
}

function EducationStep({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const addItem = () =>
    onChange({
      ...data,
      education: [
        ...data.education,
        { id: createId(), institution: "", degree: "", field: "", startDate: "", endDate: "" },
      ],
    });

  const removeItem = (id: string) =>
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });

  const updItem = (id: string, field: string, val: string) =>
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });

  return (
    <div className="space-y-6">
      {data.education.map((item, idx) => (
        <div key={item.id} className="form-block">
          <div className="mb-4 flex items-center justify-between">
            <span className="form-block-title">Учёба {idx + 1}</span>
            {data.education.length > 1 && (
              <button type="button" onClick={() => removeItem(item.id)} className="form-delete-btn">
                <Trash2 className="h-3.5 w-3.5" />
                Удалить
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Учебное заведение" value={item.institution} onChange={(v) => updItem(item.id, "institution", v)} placeholder="МГУ им. Ломоносова" />
            </div>
            <Field label="Степень" value={item.degree} onChange={(v) => updItem(item.id, "degree", v)} placeholder="Бакалавр / Магистр" />
            <Field label="Специальность" value={item.field} onChange={(v) => updItem(item.id, "field", v)} placeholder="Информатика и вычислительная техника" />
            <Field label="Год начала" value={item.startDate} onChange={(v) => updItem(item.id, "startDate", v)} placeholder="2018" />
            <Field label="Год окончания" value={item.endDate} onChange={(v) => updItem(item.id, "endDate", v)} placeholder="2022" />
          </div>
        </div>
      ))}

      <button type="button" onClick={addItem} className="form-add-btn">
        <Plus className="h-4 w-4" />
        Добавить учебное заведение
      </button>
    </div>
  );
}

function SkillsStep({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const addLang = () =>
    onChange({ ...data, languages: [...data.languages, { id: createId(), language: "", level: "" }] });

  const removeLang = (id: string) =>
    onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });

  const updLang = (id: string, field: string, val: string) =>
    onChange({
      ...data,
      languages: data.languages.map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    });

  const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2", "Родной"];

  return (
    <div className="space-y-6">
      <Textarea
        label="Навыки (через запятую)"
        value={data.skills}
        onChange={(v) => onChange({ ...data, skills: v })}
        placeholder="JavaScript, React, TypeScript, Node.js, SQL, Figma, Git, Agile"
        rows={4}
        hint="Перечислите hard и soft skills через запятую. ИИ может дополнить список."
      />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="form-block-title">Иностранные языки</span>
          <button
            type="button"
            onClick={addLang}
            className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:opacity-80"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить
          </button>
        </div>

        <div className="space-y-3">
          {data.languages.map((item) => (
            <div key={item.id} className="form-block !p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Field
                    label="Язык"
                    value={item.language}
                    onChange={(v) => updLang(item.id, "language", v)}
                    placeholder="Английский"
                  />
                </div>
                <div className="w-36">
                  <label className="mb-1.5 block text-[13px] font-medium text-[var(--fg)]">Уровень</label>
                  <select
                    value={item.level}
                    onChange={(e) => updLang(item.id, "level", e.target.value)}
                    className="field-input w-full"
                  >
                    <option value="">Выбрать...</option>
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                {data.languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLang(item.id)}
                    className="form-delete-btn mb-0.5 !px-2.5 !py-2.5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryStep({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  return (
    <div className="space-y-5">
      <div className="form-hint-box">
        <strong>Совет:</strong> Можете написать кратко — ИИ улучшит и расширит текст. Или нажмите
        «Улучшить с ИИ» и раздел заполнится автоматически.
      </div>
      <Textarea
        label="Краткое описание / О себе"
        value={data.summary}
        onChange={(v) => onChange({ ...data, summary: v })}
        placeholder="Опытный Frontend-разработчик с 5-летним стажем. Специализируюсь на React и TypeScript. Выстраивал системы с нуля в компаниях с нагрузкой 1M+ пользователей."
        rows={8}
      />
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
interface ResumeBuilderProps {
  resumeId?: string;
  initialData?: ResumeData;
  initialTitle?: string;
}

export function ResumeBuilder({ resumeId, initialData, initialTitle }: ResumeBuilderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [data, setData] = useState<ResumeData>(() =>
    initialData ? normalizeResumeData(initialData) : createEmptyResume(),
  );
  const [title, setTitle] = useState(initialTitle ?? "Моё резюме");
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Hydrate from localStorage if no initialData
  useEffect(() => {
    if (!initialData) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
        setData(normalizeResumeData(JSON.parse(raw) as ResumeData));
      } catch {
        /* ignore */
      }
      }
    }
    setHydrated(true);
  }, [initialData]);

  // Save to localStorage on change
  useEffect(() => {
    if (hydrated && !resumeId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, hydrated, resumeId]);

  const onChange = useCallback((d: ResumeData) => setData(d), []);

  const loadExample = (exampleData: ResumeData, exampleTitle: string) => {
    setData(normalizeResumeData(exampleData));
    setTitle(exampleTitle);
    setGenerated(null);
    setStep(0);
  };

  const updateDesign = useCallback(
    (design: ResumeData["design"]) => setData((prev) => ({ ...prev, design })),
    [],
  );

  const handleGenerateAI = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.contact.fullName,
          contact: data.contact,
          experience: data.experience,
          education: data.education,
          skills: data.skills,
          languages: data.languages,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Ошибка генерации");
      setGenerated(json);
      if (json.summary) setData((prev) => ({ ...prev, summary: json.summary }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка ИИ");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!session) { router.push("/login"); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = { title, data: JSON.stringify(data) };
      const url = resumeId ? `/api/resumes/${resumeId}` : "/api/resumes";
      const method = resumeId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Ошибка сохранения");
      }
      if (!resumeId) {
        const json = await res.json();
        router.push(`/builder/${json.id}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    const el = document.getElementById("resume-print-area");
    if (!el) {
      setError("Не найден preview резюме. Откройте preview справа.");
      return;
    }
    setDownloadingPdf(true);
    setError(null);
    try {
      await exportResumeToPdf(el, resumePdfFilename(data.contact.fullName));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось создать PDF. Попробуйте ещё раз.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  const currentStep = STEPS[step];
  const stepId = currentStep.id;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <ExampleGallery onLoad={loadExample} />
      {/* Top bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--fg-muted)] transition hover:bg-[var(--bg-subtle)]">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-xl font-bold text-[var(--fg)] outline-none border-b border-transparent focus:border-[var(--accent)] transition-colors pb-0.5"
            />
            <p className="text-xs text-[var(--fg-faint)]">Конструктор · HR-стандарт · A4 PDF</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleGenerateAI} loading={generating} size="sm">
            {!generating && <Sparkles className="h-4 w-4" />}
            {generating ? "Генерация..." : "Улучшить с ИИ"}
          </Button>
          {session && (
            <Button onClick={handleSave} loading={saving} variant={saved ? "secondary" : "outline"} size="sm">
              {!saving && !saved && <Save className="h-4 w-4" />}
              {!saving && saved && <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />}
              {saving ? "Сохранение..." : saved ? "Сохранено" : "Сохранить"}
            </Button>
          )}
          <Button onClick={handleDownloadPDF} loading={downloadingPdf} variant="secondary" size="sm">
            {!downloadingPdf && <Download className="h-4 w-4" />}
            {downloadingPdf ? "Создание PDF..." : "Скачать PDF"}
          </Button>
          <Button onClick={() => setShowPreviewMobile((v) => !v)} variant="ghost" size="sm" className="xl:hidden">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
          <button type="button" onClick={() => setError(null)} className="ml-3 font-semibold">✕</button>
        </div>
      )}

      {!session && (
        <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm text-[var(--fg-muted)]">
          Данные сохраняются в браузере.{" "}
          <Link href="/register" className="font-semibold text-[var(--accent)] hover:underline">
            Зарегистрируйтесь
          </Link>{" "}
          для облачного хранения.
        </div>
      )}

      {/* Template selector */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-[var(--fg-faint)]">Шаблон HR</span>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setData((prev) => ({ ...prev, template: t.id }))}
            title={t.desc}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium transition",
              data.template === t.id
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left: form */}
        <div className={cn(showPreviewMobile ? "hidden xl:block" : "block")}>
          {/* Step tabs */}
          <div className="mb-5 flex overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-1 gap-1">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition whitespace-nowrap",
                  step === i
                    ? "bg-[var(--bg-elevated)] text-[var(--fg)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--fg-faint)] hover:text-[var(--fg-muted)]",
                )}
              >
                <s.icon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          <Card padding="md">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[var(--fg)]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)]">
                <currentStep.icon className="h-4 w-4" />
              </span>
              {currentStep.label}
            </h2>

            {stepId === "design" && (
              <DesignPanel
                design={data.design}
                name={data.contact.fullName}
                onChange={updateDesign}
              />
            )}
            {stepId === "contact" && <ContactStep data={data} onChange={onChange} />}
            {stepId === "experience" && <ExperienceStep data={data} onChange={onChange} />}
            {stepId === "education" && <EducationStep data={data} onChange={onChange} />}
            {stepId === "skills" && <SkillsStep data={data} onChange={onChange} />}
            {stepId === "summary" && <SummaryStep data={data} onChange={onChange} />}

            {/* Step navigation */}
            <div className="mt-8 flex justify-between border-t border-[var(--border)] pt-6">
              <Button type="button" variant="secondary" size="sm" disabled={isFirst} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                <ChevronLeft className="h-4 w-4" />
                Назад
              </Button>
              {!isLast ? (
                <Button type="button" size="sm" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
                  Далее
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" size="sm" loading={generating} onClick={handleGenerateAI}>
                  {!generating && <Sparkles className="h-4 w-4" />}
                  Улучшить с ИИ
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right: preview */}
        <div className={cn("xl:sticky xl:top-24 xl:self-start", !showPreviewMobile ? "hidden xl:block" : "block")}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-faint)]">Preview · A4</p>
            {generated && (
              <span className="flex items-center gap-1 rounded-full bg-[var(--accent-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                <Sparkles className="h-3 w-3" />
                ИИ улучшил
              </span>
            )}
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4 shadow-[var(--shadow-md)]">
              <div className="mx-auto max-h-[520px] overflow-y-auto">
                <div className="origin-top scale-[0.52] sm:scale-[0.58] lg:scale-[0.48] xl:scale-[0.52] 2xl:scale-[0.58]">
                  <div id="resume-print-area" className="resume-document">
                    <ResumePreview data={data} generated={generated} />
                  </div>
                </div>
              </div>
            </div>
            <ScorePanel resumeData={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
