"use client";

import * as React from "react";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityNoteProps {
  note: string | null;
  onEdit: () => void;
  className?: string;
}

export function ActivityNote({ note, onEdit, className }: ActivityNoteProps) {
  const truncateNote = (text: string | null, maxLength: number = 120) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  if (!note) {
    return (
      <button
        onClick={onEdit}
        className={cn(
          "group relative flex w-full items-center gap-2 text-left min-h-[2.5rem]",
          "text-xs text-muted-foreground hover:text-foreground transition-colors",
          className
        )}
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out">
          Clique para adicionar anotação...
        </span>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 ease-out group-hover:opacity-100">
          <Edit className="h-3 w-3 text-muted-foreground" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onEdit}
      className={cn(
        "group relative flex w-full items-center gap-2 text-left min-h-[2.5rem]",
        "text-xs text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
    >
      <span className="flex-1 overflow-hidden text-ellipsis line-clamp-2 transition-all duration-200 ease-out group-hover:blur-xs group-hover:opacity-60">
        {truncateNote(note, 120)}
      </span>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 ease-out group-hover:opacity-100">
        <Edit className="h-3 w-3 text-muted-foreground" />
      </div>
    </button>
  );
}
