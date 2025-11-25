"use client";

import * as React from "react";
import { ActivityCard } from "@/components/activity-card";
import { ActivityPreviewDialog } from "@/components/activity-preview";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, ArrowRight } from "lucide-react";
import type { IWorkedActivity } from "../../actions";
import type { IActivityContent } from "@/app/(app)/activities/_models";
import { PageLoader } from "@/components/page-loader";
import { useWorkedActivities } from "../../_hooks/use-worked-activities";
import { ActivityNote } from "./ActivityNote";
import { ActivityNoteDialog } from "./ActivityNoteDialog";
import { useRouter } from "next/navigation";

interface WorkedActivitiesStepProps {
  studentId: number;
}

export function WorkedActivitiesStep({ studentId }: WorkedActivitiesStepProps) {
  const router = useRouter();
  const { activities, isLoading, refetch } = useWorkedActivities(studentId);
  const [openNoteDialog, setOpenNoteDialog] = React.useState(false);
  const [editingActivity, setEditingActivity] =
    React.useState<IWorkedActivity | null>(null);

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

  const formatScheduleTime = (
    start: Date | string,
    end: Date | string
  ): string => {
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);

    const pad = (n: number) => String(n).padStart(2, "0");

    const startTime = `${pad(startDate.getHours())}:${pad(
      startDate.getMinutes()
    )}`;
    const endTime = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
    const date = `${pad(startDate.getDate())}/${pad(
      startDate.getMonth() + 1
    )}/${String(startDate.getFullYear()).slice(-2)}`;

    return `${startTime} às ${endTime} de ${date}`;
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
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {activities.map((activity) => {
          const key = `${activity.schedule_id}-${activity.activity_id}`;
          const canvasData = getCanvasData(activity.activity_content);

          return (
            <ActivityCard
              key={key}
              name={activity.activity_name}
              canvasData={canvasData}
              actions={
                <ActivityNote
                  note={activity.note}
                  onEdit={() => handleEditNote(activity)}
                />
              }
            >
              <div className="space-y-3 mt-2  outline-1 outline-border p-2 rounded-md">
                <div
                  className="group relative flex items-start gap-1 flex-col cursor-pointer"
                  onClick={() => {
                    router.push(`/agenda/edit/${activity.schedule_id}`);
                  }}
                >
                  <div className="flex items-start gap-1 flex-col transition-all duration-200 ease-out group-hover:blur-xs group-hover:opacity-60">
                    <p className="text-sm font-medium">
                      Atividade {activity.schedule_title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatScheduleTime(
                          activity.schedule_start instanceof Date
                            ? activity.schedule_start
                            : new Date(activity.schedule_start),
                          activity.schedule_end instanceof Date
                            ? activity.schedule_end
                            : new Date(activity.schedule_end)
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-black opacity-0 transition-all duration-200 ease-out group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-bold tracking-wide">
                      Ver aula
                    </span>
                  </div>
                </div>
              </div>
            </ActivityCard>
          );
        })}
      </div>

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
