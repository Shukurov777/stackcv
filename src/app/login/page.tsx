"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout, AuthDivider, GoogleIcon } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    if (res?.ok) router.push("/dashboard");
    else { setError("Неверный email или пароль"); setLoading(false); }
  };

  return (
    <AuthLayout
      title="С возвращением"
      subtitle="Войдите, чтобы редактировать сохранённые резюме и использовать все инструменты платформы."
      perks={["Облачное хранение резюме", "Редактор оформления и фото", "Скачать PDF A4 в один клик"]}
    >
      <h1 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Вход</h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-semibold text-[var(--accent)] hover:underline">
          Регистрация
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
        Продолжить с Google
      </Button>

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="ivan@example.com"
        />
        <div className="relative">
          <Input
            label="Пароль"
            type={showPass ? "text" : "password"}
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-[38px] text-[var(--fg-faint)] hover:text-[var(--fg)]"
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          {loading ? "Вход..." : "Войти"}
        </Button>
      </form>
    </AuthLayout>
  );
}
