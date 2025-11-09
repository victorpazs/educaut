"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AvatarInput } from "@/components/avatar-input";
import { toast } from "@/lib/toast";
import { updateProfile, changePassword } from "../actions";
import { Accordion } from "@/components/ui/accordion";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialAvatar?: string | null;
}

export function ProfileForm({
  initialName,
  initialEmail,
  initialAvatar,
}: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = React.useState(initialName ?? "");
  const [email, setEmail] = React.useState(initialEmail ?? "");
  const [avatar, setAvatar] = React.useState<string | null>(
    initialAvatar ?? null
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [pwdSubmitting, setPwdSubmitting] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const response = await updateProfile({
        name,
        email,
        avatar,
      });
      if (response.success) {
        toast.success("Perfil atualizado com sucesso.");
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Não foi possível atualizar o perfil.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdSubmitting) return;
    setPwdSubmitting(true);
    try {
      const response = await changePassword({
        currentPassword,
        newPassword,
        confirm,
      });
      if (response.success) {
        toast.success("Senha atualizada com sucesso.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirm("");
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Não foi possível alterar a senha.");
    } finally {
      setPwdSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AvatarInput value={avatar} onChange={setAvatar} />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              disabled
              placeholder="voce@exemplo.com"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>

      <Accordion title="Alterar senha" defaultExpanded={false}>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
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
                onChange={(e) => setNewPassword(e.target.value)}
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
                onChange={(e) => setConfirm(e.target.value)}
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
    </div>
  );
}


