"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CanvasEditor from "@/components/canvas-editor";
import { ActivitiesTags } from "@/components/activities_tags";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toast } from "@/lib/toast";
import type { IPublicActivity } from "../_models";
import type { IActivityContent } from "@/app/(app)/activities/_models";
import { importPublicActivity } from "../actions";

export function DiscoverCell({ activity }: { activity: IPublicActivity }) {
  const router = useRouter();
  const [openImportDialog, setOpenImportDialog] = React.useState(false);

  const canvasInitialState = React.useMemo<IActivityContent["data"]>(() => {
    const content = activity?.content as unknown;
    if (
      content &&
      typeof content === "object" &&
      (content as { type?: string }).type === "canvas" &&
      (content as { data?: IActivityContent["data"] }).data
    ) {
      return (content as { data: IActivityContent["data"] }).data;
    }
    return {
      version: "6.9.0",
      objects: [],
      background: "#ffffff",
    };
  }, [activity?.content]);

  const backgroundColor: string =
    (canvasInitialState?.background as string) || "#ffffff";

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
    // Opcional: navegar para o editor da atividade importada
    if (res.data?.id) {
      router.push(`/activities/editor/${res.data.id}`);
    } else {
      router.refresh();
    }
  };

  return (
    <Card className="overflow-hidden bg-background outline h-full outline-border hover:shadow-sm transition-shadow">
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
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0"
                title="Visualizar atividade"
                aria-label="Visualizar atividade"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0"
              title="Importar atividade"
              aria-label="Importar atividade"
              onClick={(e) => {
                e.stopPropagation();
                setOpenImportDialog(true);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
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
        </div>
      </CardContent>
    </Card>
  );
}
