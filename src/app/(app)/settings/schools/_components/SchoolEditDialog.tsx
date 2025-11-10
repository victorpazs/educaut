"use client";

import * as React from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateSchool } from "../actions";
import { toast } from "@/lib/toast";
import type { ISchool } from "../_models";
import { useSession } from "@/hooks/useSession";
import { SchoolForm, type SchoolFormValues } from "@/components/school-form";

interface SchoolEditDialogProps {
  school: ISchool;
  onUpdated?: () => void;
}

export function SchoolEditDialog({ school, onUpdated }: SchoolEditDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const { reload } = useSession();

  const handleUpdate = async ({ name }: SchoolFormValues) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const response = await updateSchool({ id: school.id, name: name.trim() });
      if (response.success) {
        reload();
        toast.success("Escola atualizada com sucesso.");
        setOpen(false);
        onUpdated?.();
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Não foi possível atualizar a escola.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 p-0"
        onClick={() => setOpen(true)}
        aria-label="Editar escola"
        title="Editar escola"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar escola</DialogTitle>
            <DialogDescription>
              Atualize as informações da escola.
            </DialogDescription>
          </DialogHeader>
          <SchoolForm
            defaultName={school.name}
            submitting={submitting}
            onSubmit={handleUpdate}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
