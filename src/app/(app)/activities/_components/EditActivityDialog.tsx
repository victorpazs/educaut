import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActivityForm } from "./ActivityForm";
import { updateActivityAction } from "../actions";
import { toast } from "@/lib/toast";

type EditActivityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityId: number;
  name: string;
  description?: string | null;
  tags?: string[] | null;
  onSave?: (data: {
    name: string;
    description: string;
    tags: string[];
  }) => void | Promise<void>;
};

export function EditActivityDialog({
  open,
  onOpenChange,
  activityId,
  name,
  description,
  tags,
  onSave,
}: EditActivityDialogProps) {
  const [formName, setFormName] = React.useState<string>(name ?? "");
  const [formDescription, setFormDescription] = React.useState<string>(
    description ?? ""
  );
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    Array.isArray(tags) ? tags : []
  );

  React.useEffect(() => {
    if (open) {
      setFormName(name ?? "");
      setFormDescription(description ?? "");
      setSelectedTags(Array.isArray(tags) ? tags : []);
    }
  }, [open, name, description, tags]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    try {
      const res = await updateActivityAction({
        id: activityId,
        name: formName?.trim(),
        description: formDescription?.trim(),
        tags: selectedTags,
      });
      if (!res.success) {
        toast.error(
          "Erro",
          res.message || "Não foi possível salvar a atividade."
        );
        return;
      }
      await onSave?.({
        name: formName?.trim(),
        description: formDescription?.trim(),
        tags: selectedTags,
      });
      toast.success("Sucesso", "Atividade atualizada.");
      onOpenChange(false);
    } catch (e) {
      toast.error("Erro", "Falha ao atualizar a atividade.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações da atividade</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4">
          <ActivityForm
            name={formName}
            description={formDescription}
            selectedTags={selectedTags}
            onNameChange={setFormName}
            onDescriptionChange={setFormDescription}
            onToggleTag={handleToggleTag}
          />
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button size="sm" disabled={!formName?.trim()} onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
