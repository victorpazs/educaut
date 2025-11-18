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
};

export function SchoolFilesDialog({
  trigger,
  open,
  onOpenChange,
  title = "Seus arquivos",
  fileTypes = [],
}: SchoolFilesDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-3xl! pb-6 w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {actualOpen ? <FilesList fileTypes={fileTypes} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
