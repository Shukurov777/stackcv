"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card, SectionLabel, SectionTitle } from "@/components/ui/Card";
import { AnimateIn, StaggerIn } from "@/components/ui/AnimateIn";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Download,
  CheckCircle2,
  BarChart3,
  LayoutTemplate,
  Target,
  FileCheck,
  Globe,
  Palette,
  ImageIcon,
  BookOpen,
  Cloud,
} from "lucide-react";
import { ResumePreviewFrame } from "@/components/ResumePreviewFrame";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const FEATURES = [
  {
    icon: Sparkles,
    title: "ИИ-редактор текста",
    desc: "DeepSeek переписывает «О себе» и опыт: bullet points с глаголами действия и измеримыми результатами.",
  },
  {
    icon: BarChart3,
    title: "Оценка резюме",
    desc: "ИИ проверяет каждый раздел, выставляет балл и даёт конкретные советы — что исправить до отправки.",
  },
  {
    icon: LayoutTemplate,
    title: "3 HR-шаблона",
    desc: "Modern, Classic, Minimal — переключайте в один клик. Каждый поддерживает фото, шрифт и цвет акцента.",
  },
  {
    icon: Palette,
    title: "Редактор оформления",
    desc: "4 шрифта, 6 цветов акцента, фильтры и форма фото, расположение — настройка без дизайнера.",
  },
  {
    icon: ImageIcon,
    title: "Фото в резюме",
    desc: "Загрузите фото с устройства: 4 фильтра, круг или скругление, сбоку или сверху. Режим «Без фото» — для ATS.",
  },
  {
    icon: BookOpen,
    title: "6 готовых примеров",
    desc: "Frontend, PM, маркетинг, аналитика, дизайн, бухгалтерия — полный текст, загрузка в конструктор одной кнопкой.",
  },
  {
    icon: FileCheck,
    title: "ATS-ready",
    desc: "Стандартные заголовки разделов, единый формат дат и чистая вёрстка — резюме читают HR-системы.",
  },
  {
    icon: Download,
    title: "Скачать PDF A4",
    desc: "Один клик — файл скачивается на диск. Формат A4, без диалога печати и всплывающих окон.",
  },
  {
    icon: Cloud,
    title: "Облако и автосохранение",
    desc: "Конструктор работает без регистрации — данные в браузере. Войдите — резюме сохраняются в личном кабинете.",
  },
];

const STANDARDS = [
  { icon: Target, title: "Структура разделов", text: "Контакты → Профиль → Опыт → Образование → Навыки → Языки" },
  { icon: FileText, title: "Формат дат", text: "Единый формат периодов: «Янв 2022 — наст. время»" },
  { icon: Globe, title: "ATS-совместимость", text: "Чистый текст, без таблиц и графики — парсится системами HR" },
  { icon: CheckCircle2, title: "Bullet points", text: "Каждый пункт начинается с глагола действия и содержит результат" },
];

const TEMPLATES = [
  { id: "modern", name: "Modern", tag: "Универсальный", desc: "Двухколоночный стиль с фото в боковой панели и акцентным цветом." },
  { id: "classic", name: "Classic", tag: "Executive", desc: "Строгий формат с фото сверху — для банков, госсектора и консалтинга." },
  { id: "minimal", name: "Minimal", tag: "Tech / ATS", desc: "Чистый sans-serif для IT и стартапов — фото слева от имени." },
] as const;

function getExampleForTemplate(id: (typeof TEMPLATES)[number]["id"]) {
  return RESUME_EXAMPLES.find((e) => e.data.template === id) ?? RESUME_EXAMPLES[0];
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[var(--border)]">
          <div className="absolute inset-0 bg-glow" />
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="mx-auto max-w-3xl text-center"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-1.5 text-xs font-medium text-[var(--fg-muted)] shadow-[var(--shadow-sm)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  ATS-ready · Фото · ИИ · PDF A4
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-8 text-balance text-5xl font-bold tracking-tight text-[var(--fg)] sm:text-6xl lg:text-[4.25rem] lg:leading-[1.05]"
              >
                Резюме, которое{" "}
                <span className="text-gradient">проходит HR</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--fg-muted)]"
              >
                StackCV — платформа для создания профессиональных резюме по международным
                стандартам. Фото, редактор оформления, 6 готовых примеров, ИИ и PDF.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/register" size="lg">
                  Создать резюме
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/builder" variant="secondary" size="lg">
                  Попробовать без регистрации
                </Button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--fg-muted)]"
              >
                {[
                  ["6", "готовых примеров"],
                  ["3", "HR-шаблона"],
                  ["PDF", "скачать в один клик"],
                ].map(([val, label]) => (
                  <span key={label}>
                    <strong className="font-semibold text-[var(--fg)]">{val}</strong> {label}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Product preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-20 max-w-4xl"
            >
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)]">
                <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3">
                  <div className="flex gap-1.5">
                    {["#ef4444", "#eab308", "#22c55e"].map((c) => (
                      <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="ml-3 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-[11px] text-[var(--fg-faint)]">
                    stackcv.app/builder
                  </div>
                </div>
                <div className="grid md:grid-cols-5">
                  <div className="border-r border-[var(--border)] bg-[var(--bg-subtle)] p-6 md:col-span-2 space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">Контакты</p>
                    {["Иван Петров", "ivan@mail.ru", "+7 999 000-00-00"].map((v) => (
                      <div key={v} className="h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 flex items-center text-xs text-[var(--fg-muted)]">
                        {v}
                      </div>
                    ))}
                  </div>
                  <div className="p-6 md:col-span-3">
                    <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-1/3 rounded bg-zinc-900 p-4 text-white text-xs">
                          <div className="font-bold text-sm mb-1">Иван Петров</div>
                          <div className="text-zinc-400 text-[10px]">Frontend Dev</div>
                        </div>
                        <div className="flex-1 space-y-2 pt-1">
                          <div className="h-2 w-full rounded bg-zinc-100" />
                          <div className="h-2 w-4/5 rounded bg-zinc-100" />
                          <div className="h-2 w-3/5 rounded bg-zinc-100" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <div className="flex-1 rounded-lg bg-[var(--accent)] py-2 text-center text-xs font-semibold text-white">
                        Улучшить с ИИ
                      </div>
                      <div className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs text-[var(--fg-muted)]">
                        Оценить
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <AnimateIn className="text-center">
              <SectionLabel>Возможности</SectionLabel>
              <SectionTitle subtitle="Только то, что реально есть в конструкторе — без устаревших обещаний." className="mx-auto mt-3">
                Полноценная платформа
              </SectionTitle>
            </AnimateIn>
            <StaggerIn className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {FEATURES.map((f) => (
                <motion.div key={f.title} variants={fadeUp}>
                  <Card hover padding="md" className="h-full">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-[var(--fg)]">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">{f.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </StaggerIn>
          </div>
        </section>

        {/* HR Standards */}
        <section id="standards" className="border-y border-[var(--border)] bg-[var(--bg-subtle)] py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <AnimateIn>
                <SectionLabel>Стандарты</SectionLabel>
                <SectionTitle subtitle="Каждый шаблон построен по международным HR-нормам и требованиям ATS-систем." className="mt-3">
                  Резюме по правилам HR
                </SectionTitle>
                <Button href="/builder" className="mt-8">
                  Создать резюме
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </AnimateIn>
              <StaggerIn className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
                {STANDARDS.map((s) => (
                  <motion.div key={s.title} variants={fadeUp}>
                    <Card padding="md">
                      <s.icon className="h-5 w-5 text-[var(--accent)]" />
                      <h3 className="mt-3 text-sm font-semibold text-[var(--fg)]">{s.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--fg-muted)]">{s.text}</p>
                    </Card>
                  </motion.div>
                ))}
              </StaggerIn>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section id="templates" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <AnimateIn className="text-center">
              <SectionLabel>Шаблоны</SectionLabel>
              <SectionTitle subtitle="Три профессиональных формата с реальными примерами — загрузите и редактируйте." className="mx-auto mt-3">
                HR-шаблоны оформления
              </SectionTitle>
            </AnimateIn>
            <StaggerIn className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.1}>
              {TEMPLATES.map((t) => {
                const example = getExampleForTemplate(t.id);
                return (
                <motion.div key={t.id} variants={fadeUp}>
                  <Card hover padding="none" className="overflow-hidden">
                    <ResumePreviewFrame
                      data={example.data}
                      className="aspect-[210/297]"
                      overlay={
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3">
                          <span className="text-xs font-medium text-white/90">{example.profession}</span>
                        </div>
                      }
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-[var(--fg)]">{t.name}</h3>
                        <span className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                          {t.tag}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[var(--fg-muted)]">{t.desc}</p>
                      <Link
                        href="/builder"
                        className="mt-3 inline-flex text-xs font-semibold text-[var(--accent)] hover:underline"
                      >
                        Открыть в конструкторе →
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              );
              })}
            </StaggerIn>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)] py-24">
          <div className="mx-auto max-w-6xl px-6">
            <AnimateIn className="text-center mb-14">
              <SectionLabel>Отзывы</SectionLabel>
              <SectionTitle className="mx-auto mt-3">Пользователи о StackCV</SectionTitle>
            </AnimateIn>
            <TestimonialsCarousel />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Card padding="lg" className="relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-glow opacity-60" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">
                  Готовы к новой карьере?
                </h2>
                <p className="mx-auto mt-4 max-w-md text-[var(--fg-muted)]">
                  Создайте ATS-ready резюме за 5 минут. Бесплатно.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button href="/register" size="lg">
                    Начать бесплатно
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button href="/builder" variant="outline" size="lg">
                    Конструктор
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
