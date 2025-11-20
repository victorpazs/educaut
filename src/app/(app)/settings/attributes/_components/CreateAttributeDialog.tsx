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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "@/lib/toast";
import { createAttribute } from "../actions";
import { getAttributeLabel } from "@/lib/attributes.utils";

interface CreateAttributeDialogProps {
  attributeTypes: string[];
  onSuccess?: () => void;
}

export function CreateAttributeDialog({
  attributeTypes,
  onSuccess,
}: CreateAttributeDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [attributeData, setAttributeData] = React.useState<{
    name: string;
    typeName?: string;
  }>({ name: "", typeName: undefined });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!attributeData.typeName) {
      toast.error("Dados inválidos", "Selecione um tipo de atributo.");
      return;
    }
    if (!attributeData.name.trim()) {
      toast.error("Dados inválidos", "Informe o nome do atributo.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await createAttribute({
        typeName: attributeData.typeName,
        name: attributeData.name.trim(),
      });
      if (response.success) {
        toast.success("Atributo criado com sucesso.");
        setOpen(false);
        setAttributeData({ name: "", typeName: undefined });
        onSuccess?.();
      } else {
        toast.error("Não foi possível criar o atributo.", response.message);
      }
    } catch {
      toast.error("Erro", "Não foi possível criar o atributo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setAttributeData({ name: "", typeName: undefined });
          setIsSubmitting(false);
        }
      }}
    >
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Novo atributo
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo atributo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <div className="px-6 space-y-4">
            <div className="space-y-1">
              <label className="text-sm">Tipo de atributo</label>
              <Select
                value={attributeData.typeName}
                onValueChange={(value) =>
                  setAttributeData((prev) => ({ ...prev, typeName: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {attributeTypes.length ? (
                    attributeTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {getAttributeLabel(t)}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-secondary">
                      Nenhum tipo disponível
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm">Nome</label>
              <Input
                placeholder="Informe o nome do atributo"
                value={attributeData.name}
                onChange={(e) =>
                  setAttributeData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !attributeData.typeName ||
                !attributeData.name.trim()
              }
            >
              Criar atributo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
