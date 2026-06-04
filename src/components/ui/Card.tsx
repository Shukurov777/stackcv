import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  hover,
  padding = "md",
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}) {
  const pad = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]",
        pad[padding],
        hover && "transition-shadow duration-300 hover:shadow-[var(--shadow-lg)] hover:border-[var(--border-strong)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  subtitle,
  className,
}: {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">{children}</h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)]">{subtitle}</p>
      )}
    </div>
  );
}
