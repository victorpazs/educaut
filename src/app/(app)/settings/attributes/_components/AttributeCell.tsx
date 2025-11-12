import * as React from "react";
import type { AttributeOption } from "@/app/(app)/_attributes/_models";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toast } from "@/lib/toast";
import { Pencil, Trash } from "lucide-react";
import { deleteAttribute } from "../actions";
import { EditAttributeNameDialog } from "./EditAttributeNameDialog";

export function AttributeCell({
  option,
  onChanged,
}: {
  option: AttributeOption;
  onChanged?: () => void | Promise<void>;
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteAttribute(option.id);
      if (res.success) {
        toast.success("Atributo removido com sucesso.");
        await onChanged?.();
      } else {
        toast.error("Não foi possível remover o atributo.", res.message);
      }
    } catch {
      toast.error("Erro", "Não foi possível remover o atributo.");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <Card className="p-2" key={option.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{option.label}</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash className="h-4 w-4 text-red-600 hover:text-red-700" />
          </Button>
          <ConfirmationDialog
            title="Remover atributo"
            description="Tem certeza que deseja remover este atributo? Essa ação não pode ser desfeita."
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            onAccept={handleDelete}
            labelAccept={isDeleting ? "Removendo..." : "Remover"}
            labelDeny="Cancelar"
          />
        </div>
      </CardHeader>

      <EditAttributeNameDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        attributeId={option.id}
        initialName={option.label}
        onSuccess={() => onChanged?.()}
      />
    </Card>
  );
}
