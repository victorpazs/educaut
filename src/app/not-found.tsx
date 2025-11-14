"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Página não encontrada
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground">
          A rota que você tentou acessar não existe. Volte para a página inicial
          para continuar navegando.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Button size="lg" onClick={() => router.push("/")}>
            Voltar para o início
          </Button>
        </div>
      </div>
    </div>
  );
}
