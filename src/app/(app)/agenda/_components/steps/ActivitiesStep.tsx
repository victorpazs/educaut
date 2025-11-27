"use client";

import * as React from "react";
import { ScheduleFormData } from "../../create/_models";
import { useActivities } from "@/app/(app)/activities/_hooks/use-activities";
import { Eye, Check, CirclePlus } from "lucide-react";
import { ActivityCard } from "@/components/activity-card";
import { ActivityPreviewDialog } from "@/components/activity-preview";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/page-loader";
import type { IActivityContent } from "@/app/(app)/activities/_models";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActivityNote } from "@/app/(app)/students/_components/steps/ActivityNote";
import { ActivityNoteDialog } from "@/app/(app)/students/_components/steps/ActivityNoteDialog";
import { getScheduleActivityNotes } from "../../actions";
import { cn } from "@/lib/utils";

interface ActivitiesStepProps {
  formData: ScheduleFormData;
  onActivityChange: (activityId: number, value: boolean) => void;
  scheduleId?: number | null;
}

export function ActivitiesStep({
  formData,
  onActivityChange,
  scheduleId,
}: ActivitiesStepProps) {
  const activitiesParams = React.useMemo(() => ({ search: "", tags: [] }), []);
  const { activities, isLoading } = useActivities(activitiesParams);
  const [openPreviewDialog, setOpenPreviewDialog] = React.useState(false);
  const [selectedActivity, setSelectedActivity] = React.useState<{
    id: number;
    name: string;
    tags?: string[];
    content: unknown;
  } | null>(null);
  const [activityNotes, setActivityNotes] = React.useState<
    Record<number, string | null>
  >({});
  const [openNoteDialog, setOpenNoteDialog] = React.useState(false);
  const [editingActivityId, setEditingActivityId] = React.useState<
    number | null
  >(null);

  // Quando for edição, filtrar apenas atividades selecionadas
  const displayedActivities = React.useMemo(() => {
    if (scheduleId && formData.activityIds && formData.activityIds.length > 0) {
      return activities.filter((activity) =>
        formData.activityIds?.includes(activity.id)
      );
    }
    return activities;
  }, [activities, formData.activityIds, scheduleId]);

  const handleToggleSelection = (activityId: number) => {
    const isSelected = formData.activityIds?.includes(activityId) ?? false;
    onActivityChange(activityId, !isSelected);
  };

  const getContentInfo = (
    content: unknown
  ): {
    type: "canvas" | "upload" | null;
    canvasData?: IActivityContent["data"];
    uploadData?: { url: string; fileType: string };
  } => {
    if (!content || typeof content !== "object") {
      return { type: null };
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

    return { type: null };
  };

  React.useEffect(() => {
    const loadNotes = async () => {
      if (!scheduleId) {
        setActivityNotes({});
        return;
      }

      const res = await getScheduleActivityNotes(scheduleId);
      if (res.success && res.data) {
        setActivityNotes(res.data);
      }
    };

    loadNotes();
  }, [scheduleId]);

  const handleEditNote = (activityId: number) => {
    setEditingActivityId(activityId);
    setOpenNoteDialog(true);
  };

  const handleSaveNote = async () => {
    if (scheduleId && editingActivityId !== null) {
      const isCurrentlyLinked =
        formData.activityIds?.includes(editingActivityId) ?? false;
      if (!isCurrentlyLinked) {
        onActivityChange(editingActivityId, true);
      }

      const res = await getScheduleActivityNotes(scheduleId);
      if (res.success && res.data) {
        setActivityNotes(res.data);
      }
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedActivities.map((activity) => {
          const isSelected =
            formData.activityIds?.includes(activity.id) ?? false;
          const contentInfo = getContentInfo(activity.content);

          return (
            <ActivityCard
              key={activity.id}
              name={activity.name}
              canvasData={contentInfo.canvasData}
              uploadData={contentInfo.uploadData}
              onClick={() => {
                handleToggleSelection(activity.id);
              }}
              className={cn(
                "cursor-pointer",
                isSelected ? "ring-2 ring-primary" : ""
              )}
              actions={
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActivity({
                            id: activity.id,
                            name: activity.name,
                            tags: activity.tags,
                            content: activity.content,
                          });
                          setOpenPreviewDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Visualizar atividade</TooltipContent>
                  </Tooltip>
                </>
              }
            >
              {scheduleId && (
                <div className="mt-2 w-full">
                  <ActivityNote
                    className="w-full"
                    note={activityNotes[activity.id] || null}
                    onEdit={() => handleEditNote(activity.id)}
                  />
                </div>
              )}
            </ActivityCard>
          );
        })}
      </div>

      {selectedActivity &&
        (() => {
          const contentInfo = getContentInfo(selectedActivity.content);
          return (
            <ActivityPreviewDialog
              open={openPreviewDialog}
              onOpenChange={setOpenPreviewDialog}
              name={selectedActivity.name}
              tags={selectedActivity.tags}
              canvasData={contentInfo.canvasData}
              uploadData={contentInfo.uploadData}
            />
          );
        })()}

      {scheduleId && editingActivityId !== null && (
        <ActivityNoteDialog
          open={openNoteDialog}
          onOpenChange={setOpenNoteDialog}
          scheduleId={scheduleId}
          activityId={editingActivityId}
          initialValue={activityNotes[editingActivityId] || ""}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
}
