"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, Rocket } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { usePathname } from "next/navigation";

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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full" />
          <div className="absolute bottom-40 right-32 w-24 h-24 bg-primary rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary rounded-full" />
        </div>
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
