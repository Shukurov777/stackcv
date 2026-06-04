"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout, AuthDivider, GoogleIcon } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError("Пароль — минимум 6 символов"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка"); setLoading(false); return; }
      const login = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push(login?.ok ? "/dashboard" : "/login");
    } catch {
      setError("Ошибка соединения");
      setLoading(false);
    }
  };

  const strength = form.password.length < 6 ? 25 : form.password.length < 10 ? 50 : 100;

  return (
    <AuthLayout
      title="Профессиональное резюме за 5 минут"
      subtitle="Зарегистрируйтесь — сохраняйте резюме в облаке, используйте ИИ и скачивайте PDF A4."
      perks={["6 готовых примеров", "Фото и редактор оформления", "ИИ-генерация и оценка", "PDF A4 в один клик"]}
    >
      <h1 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Регистрация</h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-semibold text-[var(--accent)] hover:underline">
          Войти
        </Link>
      </p>

      <Button
        type="button"
        variant="secondary"
        className="mt-8 w-full"
        loading={googleLoading}
        onClick={async () => { setGoogleLoading(true); await signIn("google", { callbackUrl: "/dashboard" }); }}
      >
        {!googleLoading && <GoogleIcon />}
        Зарегистрироваться с Google
      </Button>

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <Input label="Имя" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Иван Петров" />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="ivan@example.com" />
        <div>
          <div className="relative">
            <Input label="Пароль" type={showPass ? "text" : "password"} required value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-[38px] text-[var(--fg-faint)]">
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--bg-muted)]">
              <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${strength}%` }} />
            </div>
          )}
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          {loading ? "Создание..." : "Создать аккаунт"}
        </Button>
      </form>
    </AuthLayout>
  );
}
