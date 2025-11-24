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
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">{school.name}</div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center gap-2 justify-end">
            {isCurrentSchool ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 cursor-default!"
                    aria-label="Escola atual"
                  >
                    <BadgeCheck className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Escola atual</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    aria-label="Selecionar escola"
                    onClick={handleSelectSchool}
                    disabled={isPending}
                  >
                    <Badge className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Selecionar escola</TooltipContent>
              </Tooltip>
            )}
            <SchoolEditDialog school={school} onUpdated={() => onReload()} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 text-red-600 hover:text-red-700 disabled:opacity-50"
                  aria-label="Excluir escola"
                  title="Excluir escola"
                  onClick={() => setOpenDeleteDialog(true)}
                  disabled={isCurrentSchool}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isCurrentSchool
                  ? "Mude para outra escola antes de excluir esta"
                  : "Excluir escola"}
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}
