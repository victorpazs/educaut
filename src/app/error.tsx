"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Ocorreu um erro inesperado
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground">
          Algo deu errado ao carregar a página. Você pode voltar para a página
          inicial e tentar novamente.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" onClick={() => router.push("/")}>
            Voltar para o início
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              // tenta recuperar a renderização
              reset();
            }}
          >
            Tentar novamente
          </Button>
        </div>
        {process.env.NODE_ENV !== "production" ? (
          <p className="mt-6 text-xs text-muted-foreground/80 break-words">
            {error?.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
