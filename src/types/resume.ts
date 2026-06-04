export type TemplateId = "modern" | "classic" | "minimal";

export type FontFamily = "inter" | "georgia" | "roboto" | "playfair";
export type PhotoPosition = "sidebar" | "header" | "none";
export type PhotoFilter = "none" | "professional" | "bright" | "grayscale";
export type AccentColor = "emerald" | "blue" | "slate" | "violet" | "rose" | "orange";

export interface DesignSettings {
  fontFamily: FontFamily;
  accentColor: AccentColor;
  photoUrl: string | null;
  photoPosition: PhotoPosition;
  showPhoto: boolean;
  photoFilter: PhotoFilter;
  photoShape: "circle" | "rounded";
}

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  telegram: string;
  website: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  level: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string;
  languages: LanguageItem[];
  template: TemplateId;
  design: DesignSettings;
}

export interface GeneratedContent {
  summary: string;
  experience: Array<{ id: string; bullets: string[] }>;
  skills: string[];
}

export interface ResumeExample {
  id: string;
  title: string;
  profession: string;
  description: string;
  template: TemplateId;
  data: ResumeData;
}
