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

function SectionHead({ title, accent }: { title: string; accent: string }) {
  return (
    <h2
      style={{
        fontSize: "11pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        borderBottom: `1px solid ${accent}`,
        paddingBottom: "3px",
        marginBottom: "10px",
        marginTop: 0,
        color: accent,
      }}
    >
      {title}
    </h2>
  );
}

export function ClassicTemplate({ data, generated }: Props) {
  const { contact, experience, education, languages, design } = data;
  const summary = generated?.summary || data.summary;
  const skillList = getSkills(data, generated);
  const theme = getResumeTheme(data);
  const showHeaderPhoto = design.photoPosition === "header";

  return (
    <div style={{ ...getA4Style(data), padding: "18mm 20mm", fontSize: "11pt", lineHeight: 1.5 }}>
      <header style={{ textAlign: "center", borderBottom: `2px solid ${theme.accentDark}`, paddingBottom: "12px" }}>
        {showHeaderPhoto && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <ProfilePhoto design={design} accent={theme.accent} name={contact.fullName} size={100} />
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: "22pt", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {contact.fullName || "Фамилия Имя"}
        </h1>
        {contactLine(contact) && (
          <p style={{ margin: "8px 0 0", fontSize: "9.5pt", color: "#52525b" }}>{contactLine(contact)}</p>
        )}
      </header>

      {summary && (
        <section style={{ marginTop: "16px" }}>
          <SectionHead title={SECTIONS.summary} accent={theme.accent} />
          <p style={{ margin: 0, textAlign: "justify", color: "#3f3f46" }}>{summary}</p>
        </section>
      )}

      {experience.some((e) => e.company || e.position) && (
        <section style={{ marginTop: "16px" }}>
          <SectionHead title={SECTIONS.experience} accent={theme.accent} />
          {experience.map((item) => (
            <div key={item.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <strong>{item.position || "Должность"}</strong>
                  {item.company && <span style={{ fontStyle: "italic", color: "#52525b" }}> — {item.company}</span>}
                </div>
                <span style={{ fontSize: "10pt", color: "#71717a", whiteSpace: "nowrap" }}>
                  {formatPeriod(item.startDate, item.endDate, item.isCurrent)}
                </span>
              </div>
              {getBullets(item.id, item.description, generated).length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: "18px" }}>
                  {getBullets(item.id, item.description, generated).map((b) => (
                    <li key={b} style={{ marginBottom: "2px" }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.some((e) => e.institution) && (
        <section style={{ marginTop: "16px" }}>
          <SectionHead title={SECTIONS.education} accent={theme.accent} />
          {education.map((item) => (
            <div key={item.id} style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{item.institution}</strong>
                <br />
                <span style={{ fontStyle: "italic", color: "#52525b" }}>
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </span>
              </div>
              <span style={{ fontSize: "10pt", color: "#71717a" }}>
                {formatPeriod(item.startDate, item.endDate)}
              </span>
            </div>
          ))}
        </section>
      )}

      <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {skillList.length > 0 && (
          <section>
            <SectionHead title={SECTIONS.skills} accent={theme.accent} />
            <p style={{ margin: 0 }}>{skillList.join(" · ")}</p>
          </section>
        )}
        {languages?.some((l) => l.language) && (
          <section>
            <SectionHead title={SECTIONS.languages} accent={theme.accent} />
            {languages.filter((l) => l.language).map((l) => (
              <p key={l.id} style={{ margin: "0 0 4px" }}>
                {l.language}{l.level ? ` — ${l.level}` : ""}
              </p>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
