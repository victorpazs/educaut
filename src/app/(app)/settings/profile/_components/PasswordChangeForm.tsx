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

interface PasswordChangeFormProps {
  currentPassword: string;
  newPassword: string;
  confirm: string;
  onChange: (
    field: "currentPassword" | "newPassword" | "confirm",
    value: string
  ) => void;
}

export function PasswordChangeForm({
  currentPassword,
  newPassword,
  confirm,
  onChange,
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
    <Accordion title="Alterar senha" defaultExpanded={false}>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => onChange("currentPassword", e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => onChange("newPassword", e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Label htmlFor="confirm">Confirmar nova senha</Label>
            <Input
              id="confirm"
              type="password"
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
      </form>
    </Accordion>
  );
}
