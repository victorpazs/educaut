"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/lib/toast";
import { useSession } from "@/hooks/useSession";
import { SchoolForm, type SchoolFormValues } from "@/components/school-form";
import { createSchool } from "@/app/(app)/create-school/actions";

export default function SchoolCreateDialog() {
  const router = useRouter();
  const { reload } = useSession();
  const [submitting, setSubmitting] = React.useState(false);

  const close = () => router.back();

  const handleCreate = async ({ name }: SchoolFormValues) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const response = await createSchool({ name: name.trim() });
      if (response.success) {
        reload();
        toast.success("Escola criada com sucesso.");
        close();
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Não foi possível criar a escola.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova escola</DialogTitle>
          <DialogDescription>
            Cadastre uma nova escola para gerenciar seus alunos e atividades.
          </DialogDescription>
        </DialogHeader>
        <SchoolForm
          defaultName=""
          submitting={submitting}
          onSubmit={handleCreate}
          onCancel={close}
        />
      </DialogContent>
    </Dialog>
  );
}
