"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PageLoader } from "@/components/page-loader";
import CanvasEditor from "@/components/canvas-editor";
import { useActivity } from "../../_hooks/use-activity";
import { Button } from "@/components/ui/button";
import { SettingsIcon, Trash2 } from "lucide-react";
import { EditActivityDialog } from "../../_components/EditActivityDialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { deleteActivity } from "../../actions";
import { toast } from "@/lib/toast";
import { updateActivityContentAction } from "../../actions";
import { AutoSave } from "../_helpers/AutoSave";

export default function ActivityEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { activity, isLoading, hasError, reFetch } = useActivity(
    Number(params?.id)
  );
  const [openSettings, setOpenSettings] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  React.useEffect(() => {
    if (hasError) {
      router.back();
    }
  }, [hasError, router]);

  const handleDelete = async () => {
    if (!activity) return;
    setOpenDeleteDialog(false);
    const res = await deleteActivity(activity.id);
    if (!res.success) {
      toast.error(
        "Erro",
        res.message || "Não foi possível excluir a atividade."
      );
      return;
    }
    toast.success("Sucesso", "Atividade excluída com sucesso.");
    router.refresh();
    router.back();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title={activity?.name || "Editor de atividade"}
            subtitle="Edite o conteúdo da sua atividade."
            goBack={() => router.back()}
            actions={
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOpenSettings(true)}
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar atividade
                </Button>
              </div>
            }
          />
        </div>
        {isLoading ? (
          <div className="col-span-12">
            <PageLoader />
          </div>
        ) : activity ? (
          <div className="col-span-12">
            <CanvasEditor
              name={activity.name}
              initialState={activity.content?.data}
              onSave={async (state: any) => {
                try {
                  await updateActivityContentAction({
                    id: activity.id,
                    data: state,
                  });
                } catch (e) {
                  console.error(e);
                  toast.error(
                    "Erro",
                    "Não foi possível salvar o conteúdo da atividade."
                  );
                }
              }}
              height={600}
              backgroundColor={activity.content?.data?.background || "#ffffff"}
              fullWidth
            >
              <div className="flex flex-col bg-muted rounded-lg shadow-md!">
                <CanvasEditor.Toolbar />
                <CanvasEditor.Canvas />
                <AutoSave />
              </div>
            </CanvasEditor>

            <EditActivityDialog
              open={openSettings}
              onOpenChange={setOpenSettings}
              activityId={activity.id}
              name={activity.name}
              description={activity.description}
              tags={activity.tags}
              onSave={async () => {
                reFetch();
              }}
            />

            <ConfirmationDialog
              open={openDeleteDialog}
              onOpenChange={setOpenDeleteDialog}
              title="Excluir atividade"
              description={`Tem certeza que deseja excluir a atividade "${activity.name}"? Esta ação não poderá ser desfeita.`}
              labelAccept="Excluir"
              labelDeny="Cancelar"
              onAccept={handleDelete}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
