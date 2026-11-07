"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { SteamButton } from "@/components/auth/SteamButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { authErrorMessage } from "@/lib/authErrors";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(email, password, name);
      router.push("/");
    } catch (err) {
      setError(authErrorMessage(err, "No se pudo crear la cuenta."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Crear cuenta" subtitle="Lleva el registro de tus juegos, horas y wishlist en un solo lugar.">
      {error && (
        <p role="alert" className="mb-6 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Nombre de usuario
          </label>
          <Input
            id="name"
            type="text"
            required
            autoComplete="nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu gamertag"
            className="mt-1.5"
          />
        </div>
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
        <PasswordField id="password" value={password} onChange={setPassword} autoComplete="new-password" />
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Creando cuenta" : "Crear cuenta"}
        </Button>
      </form>

      <SteamButton label="Unirse con Steam" loading={false} />

      <p className="mt-6 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-primary-text underline-offset-4 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}
