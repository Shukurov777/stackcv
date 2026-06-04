import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg)]">
          {label}
          {props.required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
      )}
      {hint && <p className="mb-1.5 text-xs text-[var(--fg-faint)]">{hint}</p>}
      <input
        id={inputId}
        className={cn(
          "field-input w-full",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, className, ...props }: TextareaProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg)]">{label}</span>
      )}
      {hint && <p className="mb-1.5 text-xs text-[var(--fg-faint)]">{hint}</p>}
      <textarea className={cn("field-input w-full resize-y min-h-[100px]", className)} {...props} />
    </label>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg)]">{label}</span>
      )}
      <select className={cn("field-input w-full", className)} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
