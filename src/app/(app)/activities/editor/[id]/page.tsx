"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PageLoader } from "@/components/page-loader";
import CanvasEditor from "@/components/canvas-editor";
import { useActivity } from "../../_hooks/use-activity";

export default function ActivityEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { activity, isLoading, hasError } = useActivity(Number(params?.id));

  React.useEffect(() => {
    if (hasError) {
      router.back();
    }
  }, [hasError, router]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title={activity?.name || "Editor de atividade"}
            subtitle="Edite o conteúdo da sua atividade."
            goBack={() => router.back()}
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
              onSave={(state) => console.log("saved", state)}
              height={600}
              backgroundColor={activity.content?.data?.background || "#ffffff"}
              fullWidth
            >
              <div className="flex flex-col bg-muted-foreground rounded-lg shadow-xl">
                <CanvasEditor.Toolbar />
                <CanvasEditor.Canvas />
              </div>
            </CanvasEditor>
          </div>
        ) : null}
      </div>
    </div>
  );
}
