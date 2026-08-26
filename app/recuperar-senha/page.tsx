"use client";

import { FormEvent, useState } from "react";
import { MailCheck, Send } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/services/auth-service";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setEmailError("Informe seu e-mail.");
      return;
    }
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
      setIsSent(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Recuperação de Acesso"
      title="Vamos recuperar seu acesso"
      description="Informe o e-mail cadastrado e enviaremos as instruções para você definir uma nova senha."
    >
      {isSent ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-foreground">Verifique seu e-mail</h1>
            <p className="text-sm text-foreground/60">
              Se <strong>{email}</strong> estiver cadastrado, você receberá um link com as instruções
              para redefinir sua senha em instantes.
            </p>
          </div>
          <a href="/login" className="text-sm font-medium text-primary hover:text-primary-hover">
            Voltar para o login
          </a>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-foreground">Recuperar senha</h1>
            <p className="text-sm text-foreground/60">
              Digite o e-mail associado à sua conta para receber o link de recuperação.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError(undefined);
              }}
              required
              error={emailError}
            />

            <Button type="submit" icon={<Send className="size-4" />} isLoading={isSubmitting}>
              Enviar link de recuperação
            </Button>
          </form>

          <a href="/login" className="text-center text-sm font-medium text-primary hover:text-primary-hover">
            Lembrou a senha? Entrar
          </a>
        </>
      )}
    </AuthLayout>
  );
}
