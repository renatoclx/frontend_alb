"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const nextFieldErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextFieldErrors.email = "Informe seu e-mail.";
    if (!password.trim()) nextFieldErrors.password = "Informe sua senha.";
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Gestão de Locações"
      title="Controle total da sua operação"
      description="Gerencie clientes, categorias e locações em um só lugar, com simplicidade e agilidade."
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Bem-vindo de volta</h1>
        <p className="text-sm text-foreground/60">Entre com seu e-mail e senha para acessar sua conta.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }}
          required
          error={fieldErrors.email}
        />
        <Input
          label="Senha"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          required
          error={fieldErrors.password}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="text-foreground/40 hover:text-foreground/70"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <Checkbox label="Lembrar-me" checked={rememberMe} onChange={setRememberMe} />
          <a href="/recuperar-senha" className="font-medium text-primary hover:text-primary-hover">
            Esqueci minha senha
          </a>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <Button type="submit" icon={<LogIn className="size-4" />} isLoading={isSubmitting}>
          Entrar
        </Button>
      </form>

      <p className="text-center text-xs text-foreground/40">
        Ambiente de teste: admin@locobra.com.br / senha123
      </p>
    </AuthLayout>
  );
}
