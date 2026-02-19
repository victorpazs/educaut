"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { EmailInput } from "@/components/ui/email-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { forgotPasswordAction } from "@/app/auth/actions";
import { toast } from "@/lib/toast";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordDialog({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Erro", "Digite seu e-mail.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await forgotPasswordAction(email);

      if (result.success) {
        toast.success("E-mail enviado", result.message);
        onOpenChange(false);
        setEmail("");
      } else {
        if (result.error?.code === "RATE_LIMIT") {
          toast.error("Limite atingido", result.message);
        } else {
          toast.error("Erro", result.message);
        }
      }
    } catch {
      toast.error("Erro", "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Esqueci minha senha</DialogTitle>
          <DialogDescription>
            Digite o e-mail da sua conta para receber um link de recuperação.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />

          <Button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full py-5 bg-primary hover:opacity-80 text-primary-foreground font-medium"
          >
            {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
