import type { DesignSettings } from "@/types/resume";
import { PHOTO_FILTER_CSS } from "@/lib/design-tokens";

interface ResumePhotoProps {
  design: DesignSettings;
  size?: number;
  className?: string;
}

export function ResumePhoto({ design, size = 88, className }: ResumePhotoProps) {
  if (!design.showPhoto || !design.photoUrl || design.photoPosition === "none") {
    return null;
  }

  const radius = design.photoShape === "circle" ? "50%" : "12px";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={design.photoUrl}
      alt="Фото профиля"
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: radius,
        display: "block",
        filter: PHOTO_FILTER_CSS[design.photoFilter],
        border: "3px solid rgba(255,255,255,0.25)",
        flexShrink: 0,
      }}
    />
  );
}

export function ResumePhotoPlaceholder({ design, size = 88, accent }: { design: DesignSettings; size?: number; accent: string }) {
  if (!design.showPhoto || design.photoPosition === "none") return null;
  const initial = "?";
  const radius = design.photoShape === "circle" ? "50%" : "12px";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: accent,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        flexShrink: 0,
        opacity: 0.85,
      }}
    >
      {initial}
    </div>
  );
}

export function ProfilePhoto({ design, accent, name, size = 88 }: { design: DesignSettings; accent: string; name: string; size?: number }) {
  if (!design.showPhoto || design.photoPosition === "none") return null;
  if (design.photoUrl) {
    return <ResumePhoto design={design} size={size} />;
  }
  const initial = name ? name.trim()[0]?.toUpperCase() ?? "?" : "?";
  const radius = design.photoShape === "circle" ? "50%" : "12px";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: accent,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}
