"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ConfirmationDialogProps = {
  title?: string;
  description?: string;
  onAccept?: () => void | Promise<void>;
  onDeny?: () => void | Promise<void>;
  labelAccept?: string;
  labelDeny?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ConfirmationDialog({
  title = "Confirmação",
  description = "Tem certeza que deseja continuar?",
  onAccept = () => console.log("accepted"),
  onDeny = () => console.log("denied"),
  labelAccept = "Sim",
  labelDeny = "Não",
  trigger,
  open,
  onOpenChange,
}: ConfirmationDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleAccept = async () => {
    await onAccept?.();
    setOpen(false);
  };

  const handleDeny = async () => {
    await onDeny?.();
    setOpen(false);
  };

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleDeny}>
            {labelDeny}
          </Button>
          <Button onClick={handleAccept}>{labelAccept}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
