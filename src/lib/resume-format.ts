import type { CSSProperties } from "react";
import type { GeneratedContent, ResumeData } from "@/types/resume";
import { getAccent, getFontStack } from "@/lib/design-tokens";

/** HR/ATS-standard section titles (RU) */
export const SECTIONS = {
  summary: "Профессиональный профиль",
  experience: "Опыт работы",
  education: "Образование",
  skills: "Ключевые навыки",
  languages: "Владение языками",
  contacts: "Контактная информация",
} as const;

export function getBullets(
  id: string,
  raw: string,
  generated?: GeneratedContent | null,
): string[] {
  const fromAi = generated?.experience.find((e) => e.id === id)?.bullets;
  if (fromAi?.length) return fromAi;
  return raw
    .split("\n")
    .map((l) => l.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);
}

export function getSkills(data: ResumeData, generated?: GeneratedContent | null): string[] {
  if (generated?.skills?.length) return generated.skills;
  return data.skills
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatPeriod(
  start: string,
  end: string,
  isCurrent?: boolean,
): string {
  const endLabel = isCurrent ? "наст. время" : end;
  return [start, endLabel].filter(Boolean).join(" — ");
}

export function contactLine(contact: ResumeData["contact"]): string {
  return [
    contact.phone,
    contact.email,
    contact.city,
    contact.linkedin,
    contact.telegram,
    contact.website,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** A4 resume base styles — 210×297mm, HR margins ~15mm */
export function getResumeTheme(data: ResumeData) {
  const accent = getAccent(data.design?.accentColor ?? "emerald");
  return {
    fontFamily: getFontStack(data.design?.fontFamily ?? "inter"),
    accent: accent.main,
    accentLight: accent.light,
    accentDark: accent.dark,
  };
}

export function getA4Style(data: ResumeData): CSSProperties {
  const theme = getResumeTheme(data);
  return {
    width: "210mm",
    minHeight: "297mm",
    maxWidth: "100%",
    margin: "0 auto",
    background: "#ffffff",
    color: "#18181b",
    boxSizing: "border-box",
    fontFamily: theme.fontFamily,
  };
}

/** @deprecated use getA4Style */
export const A4_STYLE: CSSProperties = {
  width: "210mm",
  minHeight: "297mm",
  maxWidth: "100%",
  margin: "0 auto",
  background: "#ffffff",
  color: "#18181b",
  boxSizing: "border-box",
};
