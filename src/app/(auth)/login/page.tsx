"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { SteamButton } from "@/components/auth/SteamButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { authErrorMessage } from "@/lib/authErrors";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingSteam, setLoadingSteam] = useState(false);
  const { login, loginWithSteam } = useAuth();
  const router = useRouter();

  // Retorno desde Steam: el steamId llega en la URL
  useEffect(() => {
    const steamId = new URLSearchParams(window.location.search).get("steamId");
    if (!steamId) return;

    const run = async () => {
      setLoadingSteam(true);
      try {
        await loginWithSteam(steamId);
        router.push("/");
      } catch {
        setError("No se pudo iniciar sesión con Steam. Inténtalo de nuevo.");
      } finally {
        setLoadingSteam(false);
      }
    };
    run();
  }, [loginWithSteam, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(authErrorMessage(err, "No se pudo iniciar sesión."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Iniciar sesión" subtitle="Vuelve a tu backlog y sigue donde lo dejaste.">
      {error && (
        <p role="alert" className="mb-6 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="mt-1.5"
          />
        </div>
        <PasswordField id="password" value={password} onChange={setPassword} autoComplete="current-password" />
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Entrando" : "Entrar"}
        </Button>
      </form>

      <SteamButton label="Entrar con Steam" loading={loadingSteam} />

      <p className="mt-6 text-center text-sm text-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-primary-text underline-offset-4 hover:underline">
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  );
}
