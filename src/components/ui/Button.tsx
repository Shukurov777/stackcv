import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-white shadow-[0_1px_2px_rgba(0,0,0,.08),0_4px_12px_rgba(16,185,129,.25)] hover:bg-[var(--accent-hover)] active:scale-[0.98]",
  secondary:
    "bg-[var(--bg-muted)] text-[var(--fg)] border border-[var(--border)] hover:bg-[var(--bg-subtle)]",
  outline:
    "border border-[var(--border)] bg-transparent text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
  ghost: "text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg)]",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-7 text-sm gap-2 rounded-xl font-semibold",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  href,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const cls = cn(
    "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
