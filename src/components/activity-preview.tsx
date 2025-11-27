"use client";

import * as React from "react";
import { IActivityContent } from "@/app/(app)/activities/_models";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CanvasPreview } from "./canvas-preview";
import { FilePreview } from "./school-files/FilePreview";
import { ActivitiesTags } from "./activities_tags";
import { cn } from "@/lib/utils";

interface ActivityPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  tags?: string[];
  canvasData?: IActivityContent["data"];
  uploadData?: { url: string; fileType: string };
}

export function ActivityPreviewDialog({
  open,
  onOpenChange,
  name,
  tags,
  canvasData,
  uploadData,
}: ActivityPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[1400px]! max-h-[780px]! w-full! h-full! flex flex-col p-0 gap-0"
        )}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold mb-2">
                {name}
              </DialogTitle>
              {(tags?.length ?? 0) > 0 ? (
                <ActivitiesTags
                  selectedTags={tags ?? []}
                  parentTags={tags?.map((t) => ({ label: t, tag: t })) ?? []}
                />
              ) : null}
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden p-6 min-h-0 flex flex-col">
          <div className="w-full h-full rounded-lg overflow-hidden bg-transparent relative flex-1 min-h-0">
            {canvasData ? (
              <CanvasPreview
                height={600}
                data={canvasData}
                className="w-full h-full"
              />
            ) : uploadData ? (
              <FilePreview
                url={uploadData.url}
                type={uploadData.fileType}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Sem conteúdo para exibir
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
