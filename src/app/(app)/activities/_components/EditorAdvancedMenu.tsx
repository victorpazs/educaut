"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Trash2, Globe, Lock, MoreVertical } from "lucide-react";
import { toast } from "@/lib/toast";
import { deleteActivity, updateActivityVisibilityAction } from "../actions";

interface EditorAdvancedMenuProps {
  activityId: number;
  activityName: string;
  isPublic: boolean;
  onDelete?: () => void | Promise<void>;
  onVisibilityChanged?: () => void | Promise<void>;
}

export function EditorAdvancedMenu({
  activityId,
  activityName,
  isPublic,
  onDelete,
  onVisibilityChanged,
}: EditorAdvancedMenuProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openVisibilityDialog, setOpenVisibilityDialog] = React.useState(false);
  const [targetPublic, setTargetPublic] = React.useState<boolean | null>(null);

  const nextState = (
    typeof targetPublic === "boolean" ? targetPublic : !isPublic
  ) as boolean;

  const handleDelete = async () => {
    setOpenDeleteDialog(false);
    const res = await deleteActivity(activityId);
    if (!res.success) {
      toast.error(
        "Erro",
        res.message || "Não foi possível excluir a atividade."
      );
      return;
    }
    toast.success("Sucesso", "Atividade excluída com sucesso.");
    await onDelete?.();
  };

  const handleVisibilityChange = async () => {
    const res = await updateActivityVisibilityAction({
      id: activityId,
      is_public: nextState,
    });
    if (!res.success) {
      toast.error(
        "Erro",
        res.message || "Não foi possível atualizar a visibilidade."
      );
      return;
    }
    toast.success(
      "Sucesso",
      nextState ? "Atividade tornada pública." : "Atividade tornada privada."
    );
    setTargetPublic(null);
    await onVisibilityChanged?.();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              const next = !isPublic;
              setTargetPublic(next);
              setOpenVisibilityDialog(true);
            }}
          >
            {isPublic ? (
              <Lock className="h-4 w-4 mr-2" />
            ) : (
              <Globe className="h-4 w-4 mr-2" />
            )}
            {isPublic ? "Tornar atividade privada" : "Tornar atividade pública"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar atividade
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title="Excluir atividade"
        description={`Tem certeza que deseja excluir a atividade "${activityName}"? Esta ação não poderá ser desfeita.`}
        labelAccept="Excluir"
        labelDeny="Cancelar"
        onAccept={handleDelete}
      />

      <ConfirmationDialog
        open={openVisibilityDialog}
        onOpenChange={setOpenVisibilityDialog}
        title={
          nextState ? "Tornar atividade pública" : "Tornar atividade privada"
        }
        description={
          nextState
            ? 'Ao tornar pública, a atividade ficará acessível a outros usuários para importação pela tela "Modelos".'
            : "Ao tornar privada, a atividade deixará de ser visível para importação por outros usuários."
        }
        labelAccept="Confirmar"
        labelDeny="Cancelar"
        onAccept={handleVisibilityChange}
        onDeny={() => {
          setTargetPublic(null);
        }}
      />
    </>
  );
}
