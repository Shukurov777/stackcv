"use client";

import type { DesignSettings, FontFamily, PhotoPosition, AccentColor } from "@/types/resume";
import { ACCENT_OPTIONS, FONT_OPTIONS } from "@/lib/design-tokens";
import { PhotoUpload } from "@/components/design/PhotoUpload";
import { cn } from "@/lib/utils";
import { Type, Palette, Move } from "lucide-react";

interface DesignPanelProps {
  design: DesignSettings;
  name: string;
  onChange: (design: DesignSettings) => void;
}

const POSITIONS: { id: PhotoPosition; label: string; desc: string }[] = [
  { id: "sidebar", label: "Сбоку", desc: "Modern-шаблон" },
  { id: "header", label: "Сверху", desc: "Classic-шаблон" },
  { id: "none", label: "Без фото", desc: "ATS-only" },
];

export function DesignPanel({ design, name, onChange }: DesignPanelProps) {
  return (
    <div className="space-y-6">
      <div className="form-hint-box">
        <strong>Редактор оформления</strong> — настройте внешний вид как в Canva: шрифт, цвет акцента,
        фото и его расположение. Изменения видны в preview справа.
      </div>

      <PhotoUpload design={design} name={name} onChange={onChange} />

      {/* Fonts */}
      <div className="form-block">
        <p className="form-block-title mb-3 flex items-center gap-1.5">
          <Type className="h-3.5 w-3.5" />
          Шрифт
        </p>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => onChange({ ...design, fontFamily: font.id as FontFamily })}
              className={cn(
                "rounded-xl border-2 px-3 py-3 text-left transition",
                design.fontFamily === font.id
                  ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]",
              )}
              style={{ fontFamily: font.stack }}
            >
              <span className="text-base font-semibold text-[var(--fg)]">{font.label}</span>
              <p className="mt-0.5 text-xs text-[var(--fg-faint)]">Aa Bb Cc</p>
            </button>
          ))}
        </div>
      </div>

      {/* Accent colors */}
      <div className="form-block">
        <p className="form-block-title mb-3 flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5" />
          Цвет акцента
        </p>
        <div className="flex flex-wrap gap-2">
          {ACCENT_OPTIONS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              onClick={() => onChange({ ...design, accentColor: color.id as AccentColor })}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition hover:scale-110",
                design.accentColor === color.id ? "border-[var(--fg)] scale-110" : "border-transparent",
              )}
              style={{ background: color.main }}
            >
              {design.accentColor === color.id && (
                <span className="text-xs font-bold text-white">✓</span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--fg-faint)]">
          Выбран: {ACCENT_OPTIONS.find((c) => c.id === design.accentColor)?.label}
        </p>
      </div>

      {/* Photo position */}
      <div className="form-block">
        <p className="form-block-title mb-3 flex items-center gap-1.5">
          <Move className="h-3.5 w-3.5" />
          Расположение фото
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {POSITIONS.map((pos) => (
            <button
              key={pos.id}
              type="button"
              onClick={() =>
                onChange({
                  ...design,
                  photoPosition: pos.id,
                  showPhoto: pos.id !== "none",
                })
              }
              className={cn(
                "rounded-xl border-2 px-3 py-3 text-left transition",
                design.photoPosition === pos.id
                  ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]",
              )}
            >
              <span className="text-sm font-semibold text-[var(--fg)]">{pos.label}</span>
              <p className="text-xs text-[var(--fg-faint)]">{pos.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Photo shape */}
      {design.showPhoto && design.photoPosition !== "none" && (
        <div className="form-block">
          <p className="form-block-title mb-3">Форма фото</p>
          <div className="flex gap-2">
            {(["circle", "rounded"] as const).map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => onChange({ ...design, photoShape: shape })}
                className={cn(
                  "flex-1 rounded-xl border-2 py-3 text-sm font-medium transition",
                  design.photoShape === shape
                    ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--fg)]"
                    : "border-[var(--border)] text-[var(--fg-muted)]",
                )}
              >
                {shape === "circle" ? "Круг" : "Скруглённый"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
