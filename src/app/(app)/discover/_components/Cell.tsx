"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toast } from "@/lib/toast";
import type { IPublicActivity } from "../_models";
import type { IActivityContent } from "@/app/(app)/activities/_models";
import { importPublicActivity } from "../actions";
import { ActivityCard } from "@/components/activity-card";
import { ActivityPreviewDialog } from "@/components/activity-preview";

export function DiscoverCell({ activity }: { activity: IPublicActivity }) {
  const router = useRouter();
  const [openImportDialog, setOpenImportDialog] = React.useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = React.useState(false);

  const contentInfo = React.useMemo<{
    type: "canvas" | "upload" | null;
    canvasData?: IActivityContent["data"];
    uploadData?: { url: string; fileType: string };
  }>(() => {
    const content = activity?.content as unknown;
    if (!content || typeof content !== "object") {
      return {
        type: "canvas",
        canvasData: {
          version: "6.9.0",
          objects: [],
          background: "#ffffff",
        },
      };
    }

    const contentObj = content as { type?: string; data?: unknown };
    const type = contentObj.type;

    if (type === "canvas" && contentObj.data) {
      const data = contentObj.data as IActivityContent["data"];
      return {
        type: "canvas",
        canvasData: data,
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
          uploadData: {
            url: data.url,
            fileType: data.fileType || data.file_type || "",
          },
        };
      }
    }

    return {
      type: "canvas",
      canvasData: {
        version: "6.9.0",
        objects: [],
        background: "#ffffff",
      },
    };
  }, [activity?.content]);

  const handleImport = async (id: number) => {
    setOpenImportDialog(false);
    const res = await importPublicActivity(id);
    if (!res.success) {
      toast.error(
        "Erro",
        res.message || "Não foi possível importar a atividade."
      );
      return;
    }
    toast.success("Sucesso", "Atividade importada com sucesso.");
    if (res.data?.id) {
      router.push(`/activities/editor/${res.data.id}`);
    } else {
      router.refresh();
    }
  };

  return (
    <>
      <ActivityCard
        name={activity.name}
        tags={activity.tags}
        canvasData={contentInfo.canvasData}
        uploadData={contentInfo.uploadData}
        actions={
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0"
                  aria-label="Visualizar atividade"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenPreviewDialog(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualizar atividade</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0"
                  aria-label="Importar atividade"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenImportDialog(true);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Importar atividade</p>
              </TooltipContent>
            </Tooltip>
            <ConfirmationDialog
              open={openImportDialog}
              onOpenChange={setOpenImportDialog}
              title="Importar atividade"
              description={`Deseja importar a atividade "${activity.name}" para sua escola?`}
              labelAccept="Importar"
              labelDeny="Cancelar"
              onAccept={() => handleImport(activity.id)}
            />
          </div>
        }
      />
      <ActivityPreviewDialog
        open={openPreviewDialog}
        onOpenChange={setOpenPreviewDialog}
        name={activity.name}
        tags={activity.tags}
        canvasData={contentInfo.canvasData}
        uploadData={contentInfo.uploadData}
      />
    </>
  );
}
