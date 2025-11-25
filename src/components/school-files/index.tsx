"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilesList } from "./FilesList";
import UploadDropzone from "./Upload/Dropzone";
import { Button } from "@/components/ui/button";

type SchoolFilesDialogProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  fileTypes?: string[];
  onSelectFile?: (url: string) => void;
};

export function SchoolFilesDialog({
  trigger,
  open,
  onOpenChange,
  title = "Seus arquivos",
  fileTypes = [],
  onSelectFile = () => {},
}: SchoolFilesDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleSelectFile = React.useCallback(
    (url: string) => {
      onSelectFile?.(url);
      setOpen(false);
    },
    [onSelectFile]
  );

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-5xl! max-h-[calc(100vh-4rem)]! w-full! flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {actualOpen ? (
            <FilesList onSelectFile={handleSelectFile} fileTypes={fileTypes} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
