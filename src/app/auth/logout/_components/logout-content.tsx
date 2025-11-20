"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/auth/actions";
import { loginRoute } from "@/lib/contraints";

const LOGOUT_DELAY_MS = 3000;

export function LogoutContent() {
  const [secondsLeft, setSecondsLeft] = useState(LOGOUT_DELAY_MS / 1000);
  const [isPending, startTransition] = useTransition();
  const hasLoggedOutRef = useRef(false);
  const router = useRouter();

  const handleLogout = useCallback(() => {
    if (hasLoggedOutRef.current) {
      return;
    }
    hasLoggedOutRef.current = true;
    startTransition(async () => {
      await logoutAction();
      router.replace(loginRoute);
    });
  }, [router]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeoutId = window.setTimeout(() => {
      handleLogout();
    }, LOGOUT_DELAY_MS);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [handleLogout]);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <span className="text-2xl font-semibold text-foreground">
        Encerrando sua sessão
      </span>
      <span className="text-base text-foreground">
        Detectamos uma inconsistência na sua sessão atual. Vamos desconectá-lo
        para manter tudo seguro.
      </span>
      <span className="text-sm text-muted-foreground">
        Você será redirecionado em {secondsLeft}s. Caso prefira, clique abaixo
        para sair agora.
      </span>
      <Button
        variant="default"
        onClick={handleLogout}
        disabled={isPending}
        className="min-w-[180px]"
      >
        {isPending ? "Saindo..." : "Sair agora"}
      </Button>
    </div>
  );
}
