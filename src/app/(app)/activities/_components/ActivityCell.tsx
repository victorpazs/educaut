"use client";

import * as React from "react";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import CanvasEditor from "@/components/canvas-editor";
import { ActivitiesTags } from "@/components/activities_tags";

import type { IActivity } from "../_models";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { deleteActivity } from "../actions";

type ActivityWithTags = IActivity & { tags?: string[] | null };

interface ActivityCellProps {
  activity: ActivityWithTags;
  onClick?: () => void;
}

export function ActivityCell({ activity, onClick }: ActivityCellProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();
  const canvasInitialState = React.useMemo(() => {
    const content: any = activity?.content as any;
    if (content && content.type === "canvas" && content.data) {
      return content.data;
    }
    return {
      version: "6.9.0",
      objects: [],
      background: "#ffffff",
    };
  }, [activity?.content]);

  const backgroundColor: string =
    (canvasInitialState?.background as string) || "#ffffff";

  const handleDelete = async (id: number) => {
    setOpenDeleteDialog(false);
    const res = await deleteActivity(id);
    if (!res.success) {
      toast.error("Erro", res.message || "Não foi possível excluir o aluno.");
      return;
    }
    toast.success("Sucesso", "Aluno excluído com sucesso.");
    router.refresh();
  };
  return (
    <Card
      className="overflow-hidden bg-muted outline h-full outline-border hover:shadow-sm transition-shadow"
      onClick={onClick}
    >
      <div className="w-full p-4">
        <CanvasEditor
          initialState={canvasInitialState}
          height={180}
          fullWidth
          backgroundColor={backgroundColor}
          preview
        >
          <CanvasEditor.Canvas />
        </CanvasEditor>
      </div>
      <CardContent className="pt-4">
        <div className="space-y-2 flex items-center justify-between gap-2">
          <div className="flex flex-col gap-2 items-start">
            <div className="text-sm font-medium truncate" title={activity.name}>
              {activity.name}
            </div>
            {(activity.tags?.length ?? 0) > 0 ? (
              <ActivitiesTags
                selectedTags={activity.tags ?? []}
                parentTags={
                  activity.tags?.map((t) => ({ label: t, tag: t })) ?? []
                }
              />
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/activities/editor/${activity.id}`}>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-red-600 hover:text-red-700"
              aria-label="Excluir atividade"
              title="Excluir atividade"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <ConfirmationDialog
              open={openDeleteDialog}
              onOpenChange={setOpenDeleteDialog}
              title="Excluir atividade"
              description={`Tem certeza que deseja excluir a atividade"${activity.name}"? Esta ação não poderá ser desfeita.`}
              labelAccept="Excluir"
              labelDeny="Cancelar"
              onAccept={() => handleDelete(activity.id)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
