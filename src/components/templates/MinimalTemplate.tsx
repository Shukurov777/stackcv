import type { ResumeData, GeneratedContent } from "@/types/resume";
import {
  SECTIONS,
  getBullets,
  getSkills,
  formatPeriod,
  contactLine,
  getResumeTheme,
  getA4Style,
} from "@/lib/resume-format";
import { ProfilePhoto } from "@/components/templates/ResumePhoto";

interface Props {
  data: ResumeData;
  generated?: GeneratedContent | null;
}

export function MinimalTemplate({ data, generated }: Props) {
  const { contact, experience, education, languages, design } = data;
  const summary = generated?.summary || data.summary;
  const skillList = getSkills(data, generated);
  const theme = getResumeTheme(data);
  const headline = experience.find((e) => e.position)?.position ?? "";
  const showHeaderPhoto = design.photoPosition === "header" || design.photoPosition === "sidebar";

  return (
    <div style={{ ...getA4Style(data), padding: "16mm 18mm", fontSize: "10pt", lineHeight: 1.55 }}>
      <header style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "14px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {showHeaderPhoto && (
            <ProfilePhoto design={design} accent={theme.accent} name={contact.fullName} size={80} />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "26pt", fontWeight: 600, letterSpacing: "-0.02em" }}>
              {contact.fullName || "Фамилия Имя"}
            </h1>
            {headline && (
              <p style={{ margin: "4px 0 0", fontSize: "11pt", color: theme.accent, fontWeight: 500 }}>{headline}</p>
            )}
            <p style={{ margin: "10px 0 0", fontSize: "9pt", color: "#71717a" }}>{contactLine(contact)}</p>
          </div>
        </div>
      </header>

      {summary && (
        <section style={{ marginTop: "18px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accent }}>
            {SECTIONS.summary}
          </h2>
          <p style={{ margin: 0, color: "#3f3f46" }}>{summary}</p>
        </section>
      )}

      {experience.some((e) => e.company || e.position) && (
        <section style={{ marginTop: "18px" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accent }}>
            {SECTIONS.experience}
          </h2>
          {experience.map((item) => (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginBottom: "14px" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "10.5pt" }}>{item.position || "Должность"}</p>
                <p style={{ margin: "2px 0 0", color: "#52525b" }}>{item.company}</p>
                {getBullets(item.id, item.description, generated).map((b) => (
                  <p key={b} style={{ margin: "4px 0 0", paddingLeft: "12px", color: "#3f3f46", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: theme.accent }}>—</span>
                    {b}
                  </p>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: "9pt", color: "#a1a1aa", whiteSpace: "nowrap" }}>
                {formatPeriod(item.startDate, item.endDate, item.isCurrent)}
              </p>
            </div>
          ))}
        </section>
      )}

      {education.some((e) => e.institution) && (
        <section style={{ marginTop: "18px" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accent }}>
            {SECTIONS.education}
          </h2>
          {education.map((item) => (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginBottom: "8px" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{item.institution}</p>
                <p style={{ margin: "2px 0 0", color: "#52525b" }}>{[item.degree, item.field].filter(Boolean).join(", ")}</p>
              </div>
              <p style={{ margin: 0, fontSize: "9pt", color: "#a1a1aa" }}>
                {formatPeriod(item.startDate, item.endDate)}
              </p>
            </div>
          ))}
        </section>
      )}

      {skillList.length > 0 && (
        <section style={{ marginTop: "18px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accent }}>
            {SECTIONS.skills}
          </h2>
          <p style={{ margin: 0, color: "#3f3f46" }}>{skillList.join(" · ")}</p>
        </section>
      )}

      {languages?.some((l) => l.language) && (
        <section style={{ marginTop: "14px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "8pt", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accent }}>
            {SECTIONS.languages}
          </h2>
          <p style={{ margin: 0, color: "#3f3f46" }}>
            {languages.filter((l) => l.language).map((l) => `${l.language}${l.level ? ` (${l.level})` : ""}`).join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}
