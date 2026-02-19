"use client";

import React from "react";
import { AppLogo } from "@/components/app-logo";
import { usePathname } from "next/navigation";
import { AuthParticles } from "./_components/AuthParticles";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/auth/login";
  const isLogoutPage = pathname === "/auth/logout";
  const isVerifyEmailPage = pathname?.startsWith("/auth/verify-email");
  const isPasswordRecoveryPage = pathname?.startsWith(
    "/auth/password-recovery",
  );

  if (isLogoutPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <AppLogo className="md:w-24 md:h-24 w-16 h-16" />
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-muted/30 relative overflow-hidden">
        <AuthParticles />
      </div>

      <div className="flex-1 lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {!isVerifyEmailPage && !isPasswordRecoveryPage && (
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AppLogo className="md:w-24 md:h-24 w-16 h-16" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {isLoginPage ? "Bem-vindo educador!" : "Registre-se!"}
              </h2>
              <p className="text-secondary font-medium text-lg">
                {isLoginPage
                  ? "Acesse seu painel de controle do educador."
                  : "Gerencie os seus alunos, atividades e agenda de forma simples e prática."}
              </p>
            </div>
          )}

          {(isVerifyEmailPage || isPasswordRecoveryPage) && (
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AppLogo className="md:w-24 md:h-24 w-16 h-16" />
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
