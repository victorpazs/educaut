"use client";

import { TableCell } from "@/components/ui/table";

import { TableRow } from "@/components/ui/table";
import { SchoolEditDialog } from "./SchoolEditDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { deleteSchool } from "../actions";
import { Trash2, CheckCircle2, Badge, BadgeCheck } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import type { ISchool } from "@/types/db";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/hooks/useSession";
import { useSchoolChange } from "@/hooks/useSchoolChange";
import { DeleteButton } from "@/components/delete-button";
import { Chip } from "@/components/ui/chip";

export function SchoolCell({
  school,
  onReload,
}: {
  school: ISchool;
  onReload: () => void;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { school: currentSchool } = useSession();
  const { changeSchool, isPending } = useSchoolChange();

  const isCurrentSchool = currentSchool?.id === school.id;

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

  const handleSelectSchool = () => {
    changeSchool(school);
  };

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
        <TableCell>
          <div className="flex items-center gap-2">{school.name}</div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center gap-2 justify-end">
            {isCurrentSchool ? (
              <Chip
                label="Escola selecionada"
                size="sm"
                className="text-white"
                color="primary"
              />
            ) : null}
            <SchoolEditDialog school={school} onUpdated={() => onReload()} />

            <DeleteButton
              onClick={() => setOpenDeleteDialog(true)}
              disabled={isCurrentSchool}
              title={
                isCurrentSchool
                  ? "Mude para outra escola antes de excluir esta"
                  : "Excluir escola"
              }
            />
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}
