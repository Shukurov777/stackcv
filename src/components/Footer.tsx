import Link from "next/link";

const links = {
  product: [
    { href: "/builder", label: "Конструктор" },
    { href: "/#templates", label: "Шаблоны" },
    { href: "/#features", label: "Возможности" },
  ],
  account: [
    { href: "/register", label: "Регистрация" },
    { href: "/login", label: "Вход" },
    { href: "/dashboard", label: "Мои резюме" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--fg)] text-[var(--bg)] text-sm font-bold">
                S
              </span>
              <span className="text-lg font-bold tracking-tight text-[var(--fg)]">
                Stack<span className="text-[var(--accent)]">CV</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--fg-muted)]">
              ИИ, фото, редактор оформления, 6 примеров и скачивание PDF A4 — всё в одном конструкторе.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-faint)]">
              Продукт
            </p>
            <ul className="mt-4 space-y-3">
              {links.product.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-faint)]">
              Аккаунт
            </p>
            <ul className="mt-4 space-y-3">
              {links.account.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border)] pt-8 text-xs text-[var(--fg-faint)] sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} StackCV. Все права защищены.</span>
          <span>Фото · ИИ · ATS-ready · PDF A4</span>
        </div>
      </div>
    </footer>
  );
}
