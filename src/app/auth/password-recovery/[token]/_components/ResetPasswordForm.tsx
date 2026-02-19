"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPasswordAction } from "@/app/auth/actions";
import { toast } from "@/lib/toast";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error("Erro", "A senha deve ter ao menos 6 caracteres.");
      return;
    }

    if (password !== confirm) {
      toast.error("Erro", "As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPasswordAction(token, password, confirm);

      if (result.success) {
        toast.success("Sucesso", result.message);
        router.push("/auth/login");
      } else {
        toast.error("Erro", result.message);
      }
    } catch {
      toast.error("Erro", "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <KeyRound className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Redefinir senha</h2>
          <p className="text-secondary text-sm leading-relaxed max-w-sm">
            Digite sua nova senha abaixo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          placeholder="Confirmar nova senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <Button
          type="submit"
          disabled={isSubmitting || !password || !confirm}
          className="w-full py-5 bg-primary hover:opacity-80 text-primary-foreground font-medium"
        >
          {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="text-sm font-bold text-primary hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
