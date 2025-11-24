"use client";

import * as React from "react";
import { ActivityCard } from "@/components/activity-card";
import { ActivityPreviewDialog } from "@/components/activity-preview";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { IWorkedActivity } from "../../actions";
import type { IActivityContent } from "@/app/(app)/activities/_models";
import { PageLoader } from "@/components/page-loader";
import { useWorkedActivities } from "../../_hooks/use-worked-activities";
import { ActivityNote } from "./ActivityNote";
import { ActivityNoteDialog } from "./ActivityNoteDialog";

interface WorkedActivitiesStepProps {
  studentId: number;
}

export function WorkedActivitiesStep({ studentId }: WorkedActivitiesStepProps) {
  const { activities, isLoading, refetch } = useWorkedActivities(studentId);
  const [openPreviewDialog, setOpenPreviewDialog] = React.useState(false);
  const [selectedActivity, setSelectedActivity] =
    React.useState<IWorkedActivity | null>(null);
  const [openNoteDialog, setOpenNoteDialog] = React.useState(false);
  const [editingActivity, setEditingActivity] =
    React.useState<IWorkedActivity | null>(null);

  const handlePreview = (activity: IWorkedActivity) => {
    setSelectedActivity(activity);
    setOpenPreviewDialog(true);
  };

  const getCanvasData = (
    content: unknown
  ): IActivityContent["data"] | undefined => {
    if (
      content &&
      typeof content === "object" &&
      (content as { type?: string }).type === "canvas" &&
      (content as { data?: IActivityContent["data"] }).data
    ) {
      return (content as { data: IActivityContent["data"] }).data;
    }
    return undefined;
  };

  const handleEditNote = (activity: IWorkedActivity) => {
    setEditingActivity(activity);
    setOpenNoteDialog(true);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma atividade trabalhada encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => {
          const key = `${activity.schedule_id}-${activity.activity_id}`;
          const canvasData = getCanvasData(activity.activity_content);

          return (
            <ActivityCard
              key={key}
              name={activity.activity_name}
              tags={activity.activity_tags}
              canvasData={canvasData}
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0"
                  onClick={() => handlePreview(activity)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              }
            >
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(
                      activity.schedule_start instanceof Date
                        ? activity.schedule_start
                        : new Date(activity.schedule_start)
                    )}{" "}
                    -{" "}
                    {formatDate(
                      activity.schedule_end instanceof Date
                        ? activity.schedule_end
                        : new Date(activity.schedule_end)
                    )}
                  </span>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Anotações:
                  </label>
                  <ActivityNote
                    note={activity.note}
                    onEdit={() => handleEditNote(activity)}
                  />
                </div>
              </div>
            </ActivityCard>
          );
        })}
      </div>

      {selectedActivity && (
        <ActivityPreviewDialog
          open={openPreviewDialog}
          onOpenChange={setOpenPreviewDialog}
          name={selectedActivity.activity_name}
          tags={selectedActivity.activity_tags}
          canvasData={getCanvasData(selectedActivity.activity_content)}
        />
      )}

      {editingActivity && (
        <ActivityNoteDialog
          open={openNoteDialog}
          onOpenChange={setOpenNoteDialog}
          scheduleId={editingActivity.schedule_id}
          activityId={editingActivity.activity_id}
          initialValue={editingActivity.note || ""}
          onSave={refetch}
        />
      )}
    </div>
  );
}
