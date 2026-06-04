import type { AccentColor, DesignSettings, FontFamily, PhotoFilter } from "@/types/resume";

export const FONT_OPTIONS: { id: FontFamily; label: string; stack: string }[] = [
  { id: "inter", label: "Inter", stack: "'Inter', 'Segoe UI', sans-serif" },
  { id: "georgia", label: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
  { id: "roboto", label: "Roboto", stack: "'Roboto', Arial, sans-serif" },
  { id: "playfair", label: "Playfair", stack: "'Playfair Display', Georgia, serif" },
];

export const ACCENT_OPTIONS: { id: AccentColor; label: string; main: string; light: string; dark: string }[] = [
  { id: "emerald", label: "Изумруд", main: "#059669", light: "#d1fae5", dark: "#047857" },
  { id: "blue", label: "Синий", main: "#2563eb", light: "#dbeafe", dark: "#1d4ed8" },
  { id: "slate", label: "Графит", main: "#334155", light: "#f1f5f9", dark: "#1e293b" },
  { id: "violet", label: "Фиолет", main: "#7c3aed", light: "#ede9fe", dark: "#6d28d9" },
  { id: "rose", label: "Роза", main: "#e11d48", light: "#ffe4e6", dark: "#be123c" },
  { id: "orange", label: "Оранж", main: "#ea580c", light: "#ffedd5", dark: "#c2410c" },
];

export const PHOTO_FILTER_CSS: Record<PhotoFilter, string> = {
  none: "none",
  professional: "contrast(1.08) saturate(0.95) brightness(1.02)",
  bright: "brightness(1.12) contrast(1.05) saturate(1.1)",
  grayscale: "grayscale(100%) contrast(1.1)",
};

export function getFontStack(id: FontFamily): string {
  return FONT_OPTIONS.find((f) => f.id === id)?.stack ?? FONT_OPTIONS[0].stack;
}

export function getAccent(id: AccentColor) {
  return ACCENT_OPTIONS.find((a) => a.id === id) ?? ACCENT_OPTIONS[0];
}

export function getDefaultDesign(): DesignSettings {
  return {
    fontFamily: "inter",
    accentColor: "emerald",
    photoUrl: null,
    photoPosition: "sidebar",
    showPhoto: true,
    photoFilter: "professional",
    photoShape: "circle",
  };
}

export function normalizeDesign(design?: Partial<DesignSettings>): DesignSettings {
  const defaults = getDefaultDesign();
  if (!design) return defaults;
  return { ...defaults, ...design };
}
