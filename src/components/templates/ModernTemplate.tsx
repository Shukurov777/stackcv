import type { ResumeData, GeneratedContent } from "@/types/resume";
import {
  SECTIONS,
  getBullets,
  getSkills,
  formatPeriod,
  getResumeTheme,
  getA4Style,
} from "@/lib/resume-format";
import { ProfilePhoto } from "@/components/templates/ResumePhoto";

interface Props {
  data: ResumeData;
  generated?: GeneratedContent | null;
}

function SectionHead({ title, accent }: { title: string; accent: string }) {
  return (
    <h2
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: accent,
        borderBottom: `2px solid ${accent}`,
        paddingBottom: "4px",
        marginBottom: "12px",
      }}
    >
      {title}
    </h2>
  );
}

export function ModernTemplate({ data, generated }: Props) {
  const { contact, experience, education, languages, design } = data;
  const summary = generated?.summary || data.summary;
  const skillList = getSkills(data, generated);
  const theme = getResumeTheme(data);
  const headline = experience.find((e) => e.position)?.position ?? "";
  const showSidebarPhoto = design.photoPosition === "sidebar";

  return (
    <div style={{ ...getA4Style(data), display: "flex", fontSize: "10.5pt", lineHeight: 1.45 }}>
      <aside
        style={{
          width: "32%",
          background: theme.accentDark,
          color: "#fafafa",
          padding: "20mm 14px 20mm 16px",
          flexShrink: 0,
        }}
      >
        {showSidebarPhoto && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <ProfilePhoto design={design} accent={theme.accent} name={contact.fullName} size={96} />
          </div>
        )}

        <h1 style={{ fontSize: "16pt", fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: showSidebarPhoto ? "center" : "left" }}>
          {contact.fullName || "Фамилия Имя"}
        </h1>
        {headline && (
          <p style={{ marginTop: "6px", fontSize: "9pt", color: "#a1a1aa", fontWeight: 500, textAlign: showSidebarPhoto ? "center" : "left" }}>
            {headline}
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "0.12em", color: "#71717a", marginBottom: "8px" }}>
            {SECTIONS.contacts}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "9pt", color: "#d4d4d8" }}>
            {contact.phone && <li style={{ marginBottom: "6px" }}>{contact.phone}</li>}
            {contact.email && <li style={{ marginBottom: "6px", wordBreak: "break-all" }}>{contact.email}</li>}
            {contact.city && <li style={{ marginBottom: "6px" }}>{contact.city}</li>}
            {contact.linkedin && <li style={{ marginBottom: "6px", wordBreak: "break-all" }}>{contact.linkedin}</li>}
            {contact.telegram && <li style={{ marginBottom: "6px" }}>{contact.telegram}</li>}
            {contact.website && <li style={{ wordBreak: "break-all" }}>{contact.website}</li>}
          </ul>
        </div>

        {skillList.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <p style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "0.12em", color: "#71717a", marginBottom: "8px" }}>
              {SECTIONS.skills}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {skillList.map((s) => (
                <li key={s} style={{ fontSize: "9pt", color: "#e4e4e7", marginBottom: "4px", paddingLeft: "10px", borderLeft: `2px solid ${theme.accent}` }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {languages?.some((l) => l.language) && (
          <div style={{ marginTop: "20px" }}>
            <p style={{ fontSize: "8pt", fontWeight: 700, letterSpacing: "0.12em", color: "#71717a", marginBottom: "8px" }}>
              {SECTIONS.languages}
            </p>
            {languages.filter((l) => l.language).map((l) => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "9pt", marginBottom: "4px" }}>
                <span>{l.language}</span>
                {l.level && <span style={{ color: "#71717a" }}>{l.level}</span>}
              </div>
            ))}
          </div>
        )}
      </aside>

      <main style={{ flex: 1, padding: "18mm 16px 18mm 20px" }}>
        {summary && (
          <section style={{ marginBottom: "18px" }}>
            <SectionHead title={SECTIONS.summary} accent={theme.accent} />
            <p style={{ margin: 0, color: "#3f3f46", textAlign: "justify" }}>{summary}</p>
          </section>
        )}

        {experience.some((e) => e.company || e.position) && (
          <section style={{ marginBottom: "18px" }}>
            <SectionHead title={SECTIONS.experience} accent={theme.accent} />
            {experience.map((item) => (
              <div key={item.id} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                  <div>
                    <strong style={{ fontSize: "10.5pt" }}>{item.position || "Должность"}</strong>
                    <span style={{ color: theme.accent, fontWeight: 600 }}> · </span>
                    <span style={{ color: "#52525b" }}>{item.company}</span>
                  </div>
                  <span style={{ fontSize: "9pt", color: "#71717a", whiteSpace: "nowrap" }}>
                    {formatPeriod(item.startDate, item.endDate, item.isCurrent)}
                  </span>
                </div>
                {getBullets(item.id, item.description, generated).length > 0 && (
                  <ul style={{ margin: "6px 0 0", paddingLeft: "16px", color: "#3f3f46" }}>
                    {getBullets(item.id, item.description, generated).map((b) => (
                      <li key={b} style={{ marginBottom: "3px" }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {education.some((e) => e.institution) && (
          <section>
            <SectionHead title={SECTIONS.education} accent={theme.accent} />
            {education.map((item) => (
              <div key={item.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <div>
                  <strong>{item.institution}</strong>
                  <br />
                  <span style={{ color: "#52525b", fontSize: "9.5pt" }}>
                    {[item.degree, item.field].filter(Boolean).join(", ")}
                  </span>
                </div>
                <span style={{ fontSize: "9pt", color: "#71717a", whiteSpace: "nowrap" }}>
                  {formatPeriod(item.startDate, item.endDate)}
                </span>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
