"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { withValidation } from "@/lib/validation";
import { toast } from "@/lib/toast";
import { changePassword } from "../actions";
import { passwordSchema, PasswordChangeData } from "../_models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/ui/password-input";

interface PasswordChangeFormProps {
  currentPassword: string;
  newPassword: string;
  confirm: string;
  onChange: (
    field: "currentPassword" | "newPassword" | "confirm",
    value: string
  ) => void;
  open: boolean;
  onClose: () => void;
}

export function PasswordChangeForm({
  currentPassword,
  newPassword,
  confirm,
  onChange,
  open,
  onClose,
}: PasswordChangeFormProps) {
  const [pwdSubmitting, setPwdSubmitting] = React.useState(false);

  const submitPassword = withValidation(
    passwordSchema,
    async (data: PasswordChangeData) => {
      if (pwdSubmitting) return;
      setPwdSubmitting(true);
      try {
        const response = await changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirm: data.confirm,
        });
        if (response.success) {
          toast.success("Senha atualizada com sucesso.");
          onChange("currentPassword", "");
          onChange("newPassword", "");
          onChange("confirm", "");
        } else {
          toast.error(response.message);
        }
      } catch {
        toast.error("Não foi possível alterar a senha.");
      } finally {
        setPwdSubmitting(false);
      }
    }
  );

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPassword({
      currentPassword,
      newPassword,
      confirm,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="max-w-sm!">
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 ">
                <PasswordInput
                  id="currentPassword"
                  label="Senha atual"
                  value={currentPassword}
                  onChange={(e) => onChange("currentPassword", e.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
              <div className="col-span-12 ">
                <PasswordInput
                  id="newPassword"
                  label="Nova senha"
                  value={newPassword}
                  onChange={(e) => onChange("newPassword", e.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
              <div className="col-span-12 ">
                <PasswordInput
                  id="confirm"
                  label="Confirmar nova senha"
                  value={confirm}
                  onChange={(e) => onChange("confirm", e.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={pwdSubmitting}>
                {pwdSubmitting ? "Atualizando..." : "Alterar senha"}
              </Button>
            </div>
          </form>{" "}
        </div>
      </DialogContent>
    </Dialog>
  );
}
