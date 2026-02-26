"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import {
  confirmRegistrationAction,
  verifyLoginOtpAction,
  resendOtpAction,
} from "@/app/auth/actions";
import { useEffect, useState } from "react";
export function VerifyEmailOTP() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const type = (searchParams.get("type") || "registration_otp") as
    | "registration_otp"
    | "login_otp";

  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      toast.error("Erro", "Digite o código de 6 dígitos.");
      return;
    }

    setIsVerifying(true);
    try {
      const response =
        type === "registration_otp"
          ? await confirmRegistrationAction(email, code)
          : await verifyLoginOtpAction(email, code);

      if (response.success) {
        toast.success(
          "Sucesso",
          type === "registration_otp"
            ? "Conta criada! Faça login para continuar."
            : "Login realizado com sucesso!",
        );
        router.push(type === "registration_otp" ? "/auth/login" : "/home");
      } else {
        toast.error("Erro", response.message);
      }
    } catch {
      toast.error("Erro", "Não foi possível verificar o código.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;

    setIsSending(true);
    try {
      const response = await resendOtpAction(email, type);

      if (response.error?.code === "RATE_LIMIT") {
        toast.error("Limite atingido", response.message);
        return;
      }

      toast.success("Enviado", response.message);
      setCooldown(60);
    } catch {
      toast.error("Erro", "Não foi possível reenviar o código.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            {type === "registration_otp"
              ? "Confirme seu e-mail"
              : "Verificação em duas etapas"}
          </h2>
          <p className="text-secondary text-sm leading-relaxed max-w-sm">
            Enviamos um código de 6 dígitos para{" "}
            {email ? (
              <span className="font-semibold text-foreground">{email}</span>
            ) : (
              "o seu e-mail"
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          value={code}
          onChange={handleCodeChange}
          maxLength={6}
          className="text-center text-2xl tracking-[0.5em] font-mono py-6"
        />

        <Button
          onClick={handleVerify}
          disabled={isVerifying || code.length !== 6}
          className="w-full py-5 bg-primary hover:opacity-80 text-primary-foreground font-medium"
        >
          {isVerifying ? "Verificando..." : "Confirmar código"}
        </Button>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleResend}
          disabled={cooldown > 0 || isSending || !email}
          variant="ghost"
          className="w-full text-sm"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isSending ? "animate-spin" : ""}`}
          />
          {cooldown > 0
            ? `Reenviar em ${cooldown}s`
            : isSending
              ? "Enviando..."
              : "Reenviar código"}
        </Button>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm font-bold text-primary hover:underline"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
