"use client";

import { useCallback, useTransition } from "react";

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

export function LogoutDialog({
  children,
  onClose,
  open,
}: {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
}) {
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const handleConfirmLogout = useCallback(() => {
    startLogoutTransition(async () => {
      await logoutAction();
      onClose();
    });
  }, []);

  return (
    <>
      {children}

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deseja sair da conta?</DialogTitle>
            <DialogDescription>
              Confirme se você deseja encerrar a sessão atual.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoggingOut}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Saindo..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
