"use client";

import * as React from "react";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { CanvasPreview } from "@/components/canvas-preview";
import { ActivitiesTags } from "@/components/activities_tags";
import { FilePreview } from "@/components/school-files/FilePreview";

import type { IActivity, IActivityContent } from "../_models";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { deleteActivity } from "../actions";
import { EditButton } from "@/components/edit-button";
import { DeleteButton } from "@/components/delete-button";

type ActivityWithTags = IActivity & { tags?: string[] | null };

interface ActivityCellProps {
  activity: ActivityWithTags;
  onClick?: () => void;
}

export function ActivityCell({ activity, onClick }: ActivityCellProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();

  const contentInfo = React.useMemo<{
    type: "canvas" | "upload" | null;
    canvasData: IActivityContent["data"] | null;
    uploadData: { url: string; fileType: string } | null;
  }>(() => {
    const content = activity?.content;
    if (!content || typeof content !== "object") {
      return { type: null, canvasData: null, uploadData: null };
    }

    const contentObj = content as { type?: string; data?: unknown };
    const type = contentObj.type;

    if (type === "canvas" && contentObj.data) {
      const data = contentObj.data as IActivityContent["data"];
      return {
        type: "canvas",
        canvasData: data,
        uploadData: null,
      };
    }

    if (type === "upload" && contentObj.data) {
      const data = contentObj.data as {
        url?: string;
        fileType?: string;
        file_type?: string;
      };
      if (data.url) {
        return {
          type: "upload",
          canvasData: null,
          uploadData: {
            url: data.url,
            fileType: data.fileType || data.file_type || "",
          },
        };
      }
    }

    return { type: null, canvasData: null, uploadData: null };
  }, [activity?.content]);

  const handleDelete = async (id: number) => {
    setOpenDeleteDialog(false);
    const res = await deleteActivity(id);
    if (!res.success) {
      toast.error("Erro", res.message || "Não foi possível excluir o aluno.");
      return;
    }
    toast.success("Sucesso", "Atividade excluída com sucesso.");
    router.refresh();
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contentInfo.uploadData?.url) {
      window.open(contentInfo.uploadData.url, "_blank");
    }
  };
  return (
    <Card
      className="bg-background outline h-full outline-border hover:shadow-sm transition-shadow flex flex-col"
      onClick={onClick}
    >
      <div className="w-full p-4 shrink-0">
        <div className="w-full h-[180px] rounded-lg overflow-hidden bg-muted">
          {contentInfo.type === "canvas" && contentInfo.canvasData ? (
            <CanvasPreview data={contentInfo.canvasData} />
          ) : contentInfo.type === "upload" && contentInfo.uploadData ? (
            <FilePreview
              url={contentInfo.uploadData.url}
              type={contentInfo.uploadData.fileType}
            />
          ) : null}
        </div>
      </div>
      <CardContent className="pt-4 shrink-0">
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
            {contentInfo.type === "canvas" && (
              <Link href={`/activities/editor/${activity.id}`}>
                <EditButton />
              </Link>
            )}
            {contentInfo.type === "upload" && contentInfo.uploadData && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={handlePreview}
                aria-label="Visualizar arquivo"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}

            <DeleteButton onClick={() => setOpenDeleteDialog(true)} />
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
