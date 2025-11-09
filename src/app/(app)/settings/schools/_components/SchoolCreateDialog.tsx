"use client";

import * as React from "react";
import { Plus, School as SchoolIcon } from "lucide-react";
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
import { createSchool } from "../actions";
import { toast } from "@/lib/toast";

interface SchoolCreateDialogProps {
  onCreated?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SchoolCreateDialog({
  onCreated,
  open: controlledOpen,
  onOpenChange,
}: SchoolCreateDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await createSchool({ name });
      if (response.success) {
        toast.success("Escola criada com sucesso.");
        setOpen(false);
        setName("");
        onCreated?.();
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
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Nova escola
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova escola</DialogTitle>
            <DialogDescription>
              Cadastre uma nova escola para gerenciar seus alunos e atividades.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="px-6">
              <label className="text-sm mb-2 block">Nome da escola</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Escola Municipal ABC"
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
