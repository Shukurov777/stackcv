"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  FilePlus2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#features", label: "Возможности" },
  { href: "/#templates", label: "Шаблоны" },
  { href: "/#standards", label: "Стандарты" },
];

export function Header() {
  const { data: session, status } = useSession();
  const [mobile, setMobile] = useState(false);
  const [menu, setMenu] = useState(false);

  const initials = session?.user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--fg)] text-[var(--bg)] text-sm font-bold transition group-hover:scale-105">
            S
          </span>
          <span className="text-[17px] font-bold tracking-tight text-[var(--fg)]">
            Stack<span className="text-[var(--accent)]">CV</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[var(--bg-muted)]" />
          ) : session ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-1.5 pl-1.5 pr-3 text-sm transition hover:border-[var(--border-strong)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-subtle)] text-xs font-bold text-[var(--accent)]">
                  {initials}
                </span>
                <span className="max-w-[88px] truncate font-medium text-[var(--fg)]">
                  {session.user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--fg-faint)]" />
              </button>
              <AnimatePresence>
                {menu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1.5 shadow-[var(--shadow-lg)]"
                    >
                      <div className="border-b border-[var(--border)] px-3 py-2.5 mb-1">
                        <p className="truncate text-sm font-semibold text-[var(--fg)]">
                          {session.user.name}
                        </p>
                        <p className="truncate text-xs text-[var(--fg-faint)]">
                          {session.user.email}
                        </p>
                      </div>
                      <MenuLink href="/dashboard" icon={LayoutDashboard} onClick={() => setMenu(false)}>
                        Мои резюме
                      </MenuLink>
                      <MenuLink href="/builder" icon={FilePlus2} onClick={() => setMenu(false)}>
                        Новое резюме
                      </MenuLink>
                      <button
                        type="button"
                        onClick={() => {
                          setMenu(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="h-4 w-4" />
                        Выйти
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Войти
              </Button>
              <Button href="/register" size="sm">
                Начать бесплатно
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[var(--fg-muted)] md:hidden"
          onClick={() => setMobile((v) => !v)}
        >
          {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--border)] md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobile(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-[var(--border)] pt-3 mt-3 flex flex-col gap-2">
                {session ? (
                  <>
                    <Button href="/dashboard" variant="secondary" size="sm" className="w-full">
                      Мои резюме
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-red-600"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Выйти
                    </Button>
                  </>
                ) : (
                  <>
                    <Button href="/login" variant="secondary" size="sm" className="w-full">
                      Войти
                    </Button>
                    <Button href="/register" size="sm" className="w-full">
                      Регистрация
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--fg-muted)] transition hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
