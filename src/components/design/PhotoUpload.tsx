"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, Sparkles, User } from "lucide-react";
import type { DesignSettings, PhotoFilter } from "@/types/resume";
import { PHOTO_FILTER_CSS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const FILTERS: { id: PhotoFilter; label: string }[] = [
  { id: "none", label: "Оригинал" },
  { id: "professional", label: "Профессиональный" },
  { id: "bright", label: "Яркий" },
  { id: "grayscale", label: "Ч/Б" },
];

const MAX_SIZE = 800_000; // ~800KB base64

interface PhotoUploadProps {
  design: DesignSettings;
  name: string;
  onChange: (design: DesignSettings) => void;
}

export function PhotoUpload({ design, name, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Загрузите JPG или PNG");
      return;
    }
    if (file.size > 2_000_000) {
      setError("Файл слишком большой (макс. 2 МБ)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result.length > MAX_SIZE) {
        setError("Изображение слишком большое после сжатия. Попробуйте меньший файл.");
        return;
      }
      onChange({ ...design, photoUrl: result, showPhoto: true });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    onChange({ ...design, photoUrl: null });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="form-block">
        <p className="form-block-title mb-4">Фото профиля</p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* Preview */}
          <div
            className={cn(
              "relative flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden border-2 border-dashed border-[var(--border-strong)] bg-[var(--input-bg)]",
              design.photoShape === "circle" ? "rounded-full" : "rounded-2xl",
            )}
          >
            {design.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={design.photoUrl}
                alt="Preview"
                className="h-full w-full object-cover"
                style={{ filter: PHOTO_FILTER_CSS[design.photoFilter] }}
              />
            ) : (
              <User className="h-10 w-10 text-[var(--fg-faint)]" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-sm text-[var(--fg-muted)]">
              Загрузите профессиональное фото. Рекомендуется: портрет, нейтральный фон, деловой стиль.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                <Upload className="h-4 w-4" />
                Загрузить фото
              </button>
              {design.photoUrl && (
                <button type="button" onClick={removePhoto} className="form-delete-btn">
                  <Trash2 className="h-3.5 w-3.5" />
                  Удалить
                </button>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        </div>
      </div>

      {/* Photo filters — «улучшение» */}
      {design.photoUrl && (
        <div className="form-block">
          <p className="form-block-title mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Улучшение фото
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ ...design, photoFilter: f.id })}
                className={cn(
                  "overflow-hidden rounded-xl border-2 transition",
                  design.photoFilter === f.id
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]",
                )}
              >
                <div className="aspect-square overflow-hidden bg-[var(--bg-muted)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={design.photoUrl!}
                    alt={f.label}
                    className="h-full w-full object-cover"
                    style={{ filter: PHOTO_FILTER_CSS[f.id] }}
                  />
                </div>
                <p className="py-1.5 text-center text-[11px] font-medium text-[var(--fg-muted)]">{f.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
