"use client";

import * as React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { EditAttributeNameDialog } from "./EditAttributeNameDialog";
import type { AttributeOption } from "@/app/(app)/_attributes/_models";
import { deleteAttribute } from "../actions";
import { toast } from "@/lib/toast";

export function AttributeRow({
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
    <>
      <TableRow key={option.id}>
        <TableCell className="w-full">{option.label}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash className="h-4 w-4 text-red-600 hover:text-red-700" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <ConfirmationDialog
        title="Remover atributo"
        description="Tem certeza que deseja remover este atributo? Essa ação não pode ser desfeita."
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onAccept={handleDelete}
        labelAccept={isDeleting ? "Removendo..." : "Remover"}
        labelDeny="Cancelar"
      />
      <EditAttributeNameDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        attributeId={option.id}
        initialName={option.label}
        onSuccess={() => onChanged?.()}
      />
    </>
  );
}
