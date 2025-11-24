"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PageLoader } from "@/components/page-loader";
import CanvasEditor from "@/components/canvas-editor";
import { useActivity } from "../../_hooks/use-activity";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import { EditActivityDialog } from "../../_components/EditActivityDialog";
import { toast } from "@/lib/toast";
import { updateActivityContentAction } from "../../actions";
import { AutoSave } from "../_helpers/AutoSave";
import { EditorAdvancedMenu } from "../../_components/EditorAdvancedMenu";
import type { IActivityContent } from "../../_models";

export default function ActivityEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { activity, isLoading, hasError, reFetch } = useActivity(
    Number(params?.id)
  );
  const [openSettings, setOpenSettings] = React.useState(false);

  React.useEffect(() => {
    if (hasError) {
      router.back();
    }
  }, [hasError, router]);

  const handleDelete = async () => {
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
              activity ? (
                <div className="flex items-center gap-3">
                  <EditorAdvancedMenu
                    activityId={activity.id}
                    activityName={activity.name}
                    isPublic={!!activity.is_public}
                    onDelete={handleDelete}
                    onVisibilityChanged={() => reFetch()}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setOpenSettings(true)}
                  >
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                </div>
              ) : null
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
              onSave={async (state) => {
                try {
                  await updateActivityContentAction({
                    id: activity.id,
                    data: state as IActivityContent["data"],
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
          </div>
        ) : null}
      </div>
    </div>
  );
}
