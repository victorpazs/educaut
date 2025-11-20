"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/auth/actions";
import { loginRoute } from "@/lib/contraints";

export function LogoutDialog({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) {
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const router = useRouter();

  const handleConfirmLogout = useCallback(() => {
    startLogoutTransition(async () => {
      await logoutAction();
      router.replace(loginRoute);
      onClose();
    });
  }, [router, onClose]);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deseja sair da conta?</DialogTitle>
            <DialogDescription>
              Confirme se você deseja encerrar a sessão atual.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              disabled={isLoggingOut}
            >
              Não
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Saindo..." : "Sim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
