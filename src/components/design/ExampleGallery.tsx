"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Sparkles } from "lucide-react";
import { RESUME_EXAMPLES, cloneExampleData } from "@/lib/resume-examples";
import type { ResumeData } from "@/types/resume";
import { ResumePreviewFrame } from "@/components/ResumePreviewFrame";
import { cn } from "@/lib/utils";

interface ExampleGalleryProps {
  onLoad: (data: ResumeData, title: string) => void;
}

export function ExampleGallery({ onLoad }: ExampleGalleryProps) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[var(--bg-subtle)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--fg)]">Готовые примеры резюме</p>
            <p className="text-xs text-[var(--fg-faint)]">
              {RESUME_EXAMPLES.length} профессий с реальным текстом — загрузите и редактируйте
            </p>
          </div>
        </div>
        <ChevronDown className={cn("h-5 w-5 text-[var(--fg-faint)] transition", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[var(--border)]"
          >
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {RESUME_EXAMPLES.map((example) => (
                <div
                  key={example.id}
                  className={cn(
                    "group overflow-hidden rounded-xl border-2 transition cursor-pointer",
                    selected === example.id
                      ? "border-[var(--accent)] shadow-[var(--shadow-md)]"
                      : "border-[var(--border)] hover:border-[var(--border-strong)]",
                  )}
                  onClick={() => setSelected(example.id)}
                >
                  {/* Mini preview */}
                  <ResumePreviewFrame
                    data={example.data}
                    className="h-52"
                    overlay={
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                          {example.data.template}
                        </span>
                      </div>
                    }
                  />

                  <div className="p-3">
                    <p className="text-sm font-semibold text-[var(--fg)]">{example.profession}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--fg-muted)]">{example.description}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoad(cloneExampleData(example), example.title);
                        setOpen(false);
                      }}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] py-2 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      <Sparkles className="h-3 w-3" />
                      Использовать пример
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
