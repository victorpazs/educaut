"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { createActivityAction, CreateActivityInput } from "../actions";
import { ActivityForm } from "./ActivityForm";

interface NewActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: number) => void;
}

export function NewActivityDialog({
  open,
  onOpenChange,
  onCreated,
}: NewActivityDialogProps) {
  const [creating, setCreating] = React.useState(false);
  const [activity, setActivity] = React.useState<CreateActivityInput>({
    name: "",
    description: "",
    tags: [],
  });

  const resetForm = () => {
    setActivity({
      name: "",
      description: "",
      tags: [],
    });
  };

  const toggleTag = (tag: string) => {
    setActivity((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const handleCreate = async () => {
    if (!activity.name.trim()) {
      toast.error("Validação", "O nome da atividade é obrigatório.");
      return;
    }
    try {
      setCreating(true);
      const res = await createActivityAction({
        name: activity.name.trim(),
        description: activity.description?.trim() || undefined,
        tags: activity.tags,
      });
      if (!res.success || !res.data) {
        toast.error(
          "Erro",
          res.message || "Não foi possível criar a atividade."
        );
        return;
      }
      onCreated?.(res.data.id);
      setCreating(false);
      resetForm();
    } catch {
      toast.error("Erro", "Não foi possível criar a atividade.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={resetForm}>
        <DialogHeader>
          <DialogTitle>Nova atividade</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-4">
          <ActivityForm
            name={activity.name}
            description={activity.description || ""}
            selectedTags={activity.tags}
            onNameChange={(value) =>
              setActivity((prev) => ({ ...prev, name: value }))
            }
            onDescriptionChange={(value) =>
              setActivity((prev) => ({ ...prev, description: value }))
            }
            onToggleTag={toggleTag}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={creating}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
