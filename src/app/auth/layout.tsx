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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Dashboard Preview */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-muted/30 relative overflow-hidden">
        <AuthParticles />
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Desktop Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <AppLogo className="md:w-24 md:h-24 w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isLoginPage
                ? "Bem-vindo de volta, educador!"
                : "Bem-vindo, educador!"}
            </h2>
            <p className="text-muted-foreground">
              {isLoginPage
                ? "Acesse seu painel de controle do educador."
                : "Gerencie os seus alunos, atividades e agenda de forma simples e prática."}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
