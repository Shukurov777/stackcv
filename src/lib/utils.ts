import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ResumeData } from "@/types/resume";
import { getDefaultDesign } from "@/lib/design-tokens";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createId(): string {
  return crypto.randomUUID();
}

export function createEmptyResume(): ResumeData {
  return {
    contact: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      linkedin: "",
      telegram: "",
      website: "",
    },
    summary: "",
    experience: [
      {
        id: createId(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
      },
    ],
    education: [
      {
        id: createId(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: "",
    languages: [{ id: createId(), language: "", level: "" }],
    template: "modern",
    design: getDefaultDesign(),
  };
}
