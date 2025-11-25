"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { updateScheduleActivityNote } from "../../actions";

interface ActivityNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: number;
  activityId: number;
  initialValue: string;
  onSave: () => Promise<void>;
}

export function ActivityNoteDialog({
  open,
  onOpenChange,
  scheduleId,
  activityId,
  initialValue,
  onSave,
}: ActivityNoteDialogProps) {
  const [note, setNote] = React.useState(initialValue);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setNote(initialValue);
  }, [initialValue, open]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const res = await updateScheduleActivityNote(
        scheduleId,
        activityId,
        note
      );

      if (!res.success) {
        toast.error(
          "Erro",
          res.message || "Não foi possível salvar a anotação."
        );
        return;
      }

      toast.success("Sucesso", "Anotação salva com sucesso.");
      await onSave();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro", "Falha ao salvar a anotação.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anotações de aula</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 px-6">
          <div className="space-y-2">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Adicione anotações sobre o que foi trabalhado..."
              className="min-h-32 text-sm"
              disabled={isSaving}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
