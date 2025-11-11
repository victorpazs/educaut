"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AvatarInput } from "@/components/avatar-input";
import { toast } from "@/lib/toast";
import { updateProfile } from "../actions";
import { withValidation } from "@/lib/validation";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { profileSchema, ProfileData } from "../_models";

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
  const [userData, setUserData] = React.useState({
    name: initialName ?? "",
    email: initialEmail ?? "",
    avatar: (initialAvatar ?? null) as string | null,
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false);

  const submitProfile = withValidation(
    profileSchema,
    async (data: ProfileData) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const response = await updateProfile({
          name: data.name,
          avatar: data.avatar ?? null,
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
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitProfile({
      name: userData.name,
      avatar: userData.avatar,
    });
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3">
            <AvatarInput
              value={userData.avatar}
              onChange={(val) =>
                setUserData((prev) => ({ ...prev, avatar: val }))
              }
            />
          </div>

          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="col-span-12">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  readOnly
                  disabled
                  placeholder="voce@exemplo.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            type="button"
            variant="secondary"
            onClick={() => setPasswordModalOpen(true)}
          >
            Alterar senha
          </Button>
          <Button size="sm" type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>

      <PasswordChangeForm
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        currentPassword={userData.currentPassword}
        newPassword={userData.newPassword}
        confirm={userData.confirm}
        onChange={(field, value) =>
          setUserData((prev) => ({ ...prev, [field]: value }))
        }
      />
    </div>
  );
}
