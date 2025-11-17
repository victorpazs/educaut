"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Globe, Lock } from "lucide-react";
import { toast } from "@/lib/toast";
import { updateActivityVisibilityAction } from "../actions";

interface VisibilityToggleButtonProps {
  activityId: number;
  isPublic: boolean;
  onChanged?: (isPublic: boolean) => void | Promise<void>;
}

export function VisibilityToggleButton({
  activityId,
  isPublic,
  onChanged,
}: VisibilityToggleButtonProps) {
  const [openVisibilityDialog, setOpenVisibilityDialog] = React.useState(false);
  const [targetPublic, setTargetPublic] = React.useState<boolean | null>(null);

  const nextState = (
    typeof targetPublic === "boolean" ? targetPublic : !isPublic
  ) as boolean;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            onClick={() => {
              const next = !isPublic;
              setTargetPublic(next);
              setOpenVisibilityDialog(true);
            }}
          >
            {isPublic ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 max-w-56">
            <span className="font-semibold!">
              {isPublic
                ? "Tornar atividade privada"
                : "Tornar atividade pública"}
            </span>
            <br />
            <br />
            <span>
              Se pública, fica acessível a outros usuários para importação
              através da tela &quot;Modelos&quot;.
            </span>
          </div>
        </TooltipContent>
      </Tooltip>

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
        onAccept={async () => {
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
            nextState
              ? "Atividade tornada pública."
              : "Atividade tornada privada."
          );
          setTargetPublic(null);
          await onChanged?.(nextState);
        }}
        onDeny={() => {
          setTargetPublic(null);
        }}
      />
    </>
  );
}
