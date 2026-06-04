import type { ResumeData } from "@/types/resume";
import { getDefaultDesign, normalizeDesign } from "@/lib/design-tokens";

/** Ensure old saved resumes get design field */
export function normalizeResumeData(raw: Partial<ResumeData>): ResumeData {
  const empty = createEmptyResumeBase();
  return {
    ...empty,
    ...raw,
    contact: { ...empty.contact, ...(raw.contact ?? {}) },
    design: normalizeDesign(raw.design as ResumeData["design"]),
    experience: Array.isArray(raw.experience) && raw.experience.length > 0 ? raw.experience : empty.experience,
    education: Array.isArray(raw.education) && raw.education.length > 0 ? raw.education : empty.education,
    languages: Array.isArray(raw.languages) && raw.languages.length > 0 ? raw.languages : empty.languages,
    template: (raw.template as ResumeData["template"]) ?? "modern",
  };
}

function createEmptyResumeBase(): ResumeData {
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
    experience: [],
    education: [],
    skills: "",
    languages: [],
    template: "modern",
    design: getDefaultDesign(),
  };
}
