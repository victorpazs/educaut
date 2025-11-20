"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { updateAttributeName } from "../actions";

type EditAttributeNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attributeId: number;
  initialName: string;
  onSuccess?: () => void;
};

export function EditAttributeNameDialog({
  open,
  onOpenChange,
  attributeId,
  initialName,
  onSuccess,
}: EditAttributeNameDialogProps) {
  const [name, setName] = React.useState(initialName);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(initialName);
      setIsSubmitting(false);
    }
  }, [open, initialName]);

  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Dados inválidos", "Informe o nome do atributo.");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await updateAttributeName(attributeId, trimmed);
      if (res.success) {
        toast.success("Atributo atualizado com sucesso.");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error("Não foi possível atualizar o atributo.", res.message);
      }
    } catch {
      toast.error("Erro", "Não foi possível atualizar o atributo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setName(initialName);
          setIsSubmitting(false);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar nome do atributo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate}>
          <div className="px-6 space-y-4">
            <div className="space-y-1">
              <label className="text-sm">Nome</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Informe o nome"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
