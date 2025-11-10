import { TableCell } from "@/components/ui/table";

import { TableRow } from "@/components/ui/table";
import { SchoolEditDialog } from "./SchoolEditDialog";
import { ISchool } from "../_models";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { deleteSchool } from "../actions";
import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

export function SchoolCell({
  school,
  onReload,
}: {
  school: ISchool;
  onReload: () => void;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDelete = async (id: number) => {
    setOpenDeleteDialog(false);
    const res = await deleteSchool(id);
    if (!res.success) {
      toast.error("Erro", res.message || "Não foi possível excluir a escola.");
      return;
    }
    toast.success("Sucesso", "Escola excluída com sucesso.");
    onReload();
  };
  const createdDate = school.created_at
    ? new Date(school.created_at).toLocaleDateString("pt-BR")
    : null;
  return (
    <>
      <ConfirmationDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title="Excluir escola"
        description={`Tem certeza que deseja excluir "${school.name}"? Esta ação não poderá ser desfeita.`}
        onAccept={() => handleDelete(school.id)}
      />
      <TableRow key={school.id}>
        <TableCell className="font-medium">{school.name}</TableCell>
        <TableCell>{createdDate ?? "-"}</TableCell>
        <TableCell className="text-right">
          <SchoolEditDialog school={school} onUpdated={() => onReload()} />

          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 text-red-600 hover:text-red-700"
            aria-label="Excluir escola"
            title="Excluir escola"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
