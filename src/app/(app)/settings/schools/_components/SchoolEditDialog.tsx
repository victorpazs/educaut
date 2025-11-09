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
import { Input } from "@/components/ui/input";
import { updateSchool } from "../actions";
import { toast } from "@/lib/toast";
import type { ISchool } from "../_models";

interface SchoolEditDialogProps {
  school: ISchool;
  onUpdated?: () => void;
}

export function SchoolEditDialog({ school, onUpdated }: SchoolEditDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(school.name);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(school.name);
    }
  }, [open, school.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await updateSchool({ id: school.id, name });
      if (response.success) {
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
            <DialogDescription>Atualize as informações da escola.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="px-6">
              <label className="text-sm mb-2 block">Nome da escola</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da escola"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}


