"use client";

import * as React from "react";
import { useActivities } from "@/app/(app)/activities/_hooks/use-activities";
import { Eye } from "lucide-react";
import { ActivityCard } from "@/components/activity-card";
import { ActivityPreviewDialog } from "@/components/activity-preview";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/page-loader";
import type { IActivityContent } from "@/app/(app)/activities/_models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedActivityIds: number[];
  onAddActivity: (activityId: number) => void;
}

export function AddActivityDialog({
  open,
  onOpenChange,
  selectedActivityIds,
  onAddActivity,
}: AddActivityDialogProps) {
  const activitiesParams = React.useMemo(() => ({ search: "", tags: [] }), []);
  const { activities, isLoading } = useActivities(activitiesParams);
  const [openPreviewDialog, setOpenPreviewDialog] = React.useState(false);
  const [selectedActivity, setSelectedActivity] = React.useState<{
    id: number;
    name: string;
    tags?: string[];
    content: unknown;
  } | null>(null);

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

  const availableActivities = React.useMemo(() => {
    return activities.filter(
      (activity) => !selectedActivityIds.includes(activity.id)
    );
  }, [activities, selectedActivityIds]);

  const handleAddActivity = (activityId: number) => {
    onAddActivity(activityId);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl! w-full max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Adicionar atividade</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <PageLoader />
            ) : availableActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Todas as atividades já foram adicionadas
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {availableActivities.map((activity) => {
                  const contentInfo = getContentInfo(activity.content);

                  return (
                    <ActivityCard
                      key={activity.id}
                      name={activity.name}
                      canvasData={contentInfo.canvasData}
                      uploadData={contentInfo.uploadData}
                      onClick={() => handleAddActivity(activity.id)}
                      className={cn(
                        "cursor-pointer hover:ring-2 hover:ring-primary transition-all"
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
                            <TooltipContent>
                              Visualizar atividade
                            </TooltipContent>
                          </Tooltip>
                        </>
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
