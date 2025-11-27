"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityNoteProps {
  note: string | null;
  onEdit: () => void;
  className?: string;
}

export function ActivityNote({ note, onEdit, className }: ActivityNoteProps) {
  const label = note ? "Ver anotações" : "Adicionar anotações";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onEdit();
      }}
      className={cn("text-xs font-normal", className)}
    >
      <Pencil className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
