"use client";

import * as React from "react";
import { Combobox } from "@/components/ui/combobox";
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

interface ActivitiesStepProps {
  formData: ScheduleFormData;
  onActivityChange: (activityId: number, value: boolean) => void;
}

export function ActivitiesStep({
  formData,
  onActivityChange,
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

  const options = React.useMemo(
    () =>
      activities.map((activity) => ({
        value: activity.id,
        label: activity.name,
      })),
    [activities]
  );

  const handleAdd = (option: { value: number; label: string }) => {
    const alreadySelected =
      formData.activityIds?.includes(option.value) ?? false;
    if (!alreadySelected) {
      onActivityChange(option.value, true);
    }
  };

  const handleRemove = (option: { value: number; label: string }) => {
    const alreadySelected =
      formData.activityIds?.includes(option.value) ?? false;
    if (alreadySelected) {
      onActivityChange(option.value, false);
    }
  };

  const handleToggleSelection = (activityId: number) => {
    const isSelected = formData.activityIds?.includes(activityId) ?? false;
    onActivityChange(activityId, !isSelected);
  };

  const handlePreview = (activity: {
    id: number;
    name: string;
    tags?: string[] | null;
    content: unknown;
  }) => {
    setSelectedActivity({
      id: activity.id,
      name: activity.name,
      tags: activity.tags ?? undefined,
      content: activity.content,
    });
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

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => {
          const isSelected =
            formData.activityIds?.includes(activity.id) ?? false;
          const canvasData = getCanvasData(activity.content);

          return (
            <ActivityCard
              key={activity.id}
              name={activity.name}
              canvasData={canvasData}
              className={isSelected ? "ring-2 ring-primary" : ""}
              actions={
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Visualizar atividade</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-10 w-10 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelection(activity.id);
                        }}
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <CirclePlus className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isSelected
                        ? "Atividade selecionada"
                        : "Selecionar atividade"}
                    </TooltipContent>
                  </Tooltip>
                </>
              }
            />
          );
        })}
      </div>

      {selectedActivity && (
        <ActivityPreviewDialog
          open={openPreviewDialog}
          onOpenChange={setOpenPreviewDialog}
          name={selectedActivity.name}
          tags={selectedActivity.tags}
          canvasData={getCanvasData(selectedActivity.content)}
        />
      )}
    </div>
  );
}
