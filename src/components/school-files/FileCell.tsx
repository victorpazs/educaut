"use client";

import * as React from "react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ExternalLink, Trash } from "lucide-react";
import { formatFileSize } from "./utils";
import { FilePreview } from "./FilePreview";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { deleteSchoolFile } from "@/app/(app)/_files/actions";
import { toast } from "@/lib/toast";

type FileCellProps = {
  file: {
    id: number;
    type: string;
    size: number;
    url: string;
    status: number | null;
    created_at: Date | string | null;
  };
  className?: string;
  height?: number;
  onClick?: () => void;
  onDeleted?: () => void | Promise<void>;
};

export function FileCell({
  file,
  className,
  height = 180,
  onClick,
  onDeleted,
}: FileCellProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fileName = React.useMemo(() => {
    try {
      const urlParts = file.url.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      return lastPart.split("?")[0] || "Arquivo";
    } catch {
      return "Arquivo";
    }
  }, [file.url]);

  const handleOpen = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      window.open(file.url, "_blank", "noopener,noreferrer");
    },
    [file.url]
  );

  const handleDelete = React.useCallback(async () => {
    try {
      setIsDeleting(true);
      const res = await deleteSchoolFile(file.id);
      if (res.success) {
        toast.success("Arquivo removido com sucesso.");
        await onDeleted?.();
      } else {
        toast.error("Não foi possível remover o arquivo.", res.message);
      }
    } catch (error) {
      toast.error("Erro", "Não foi possível remover o arquivo.");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  }, [file.id, onDeleted]);

  const handleDeleteClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmOpen(true);
  }, []);

  return (
    <Card
      className={cn(
        "bg-background outline h-full outline-border hover:shadow-sm transition-shadow flex flex-col",
        className,
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick}
    >
      <div className="w-full p-4 shrink-0">
        <div
          className="w-full rounded-lg overflow-hidden bg-muted"
          style={{ height: `${height}px` }}
        >
          <FilePreview url={file.url} type={file.type} className="h-full" />
        </div>
      </div>
      <CardContent className="pt-4 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="space-y-2 flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2 items-start min-w-0 flex-1">
              <div
                className="text-sm font-medium truncate w-full"
                title={fileName}
              >
                {fileName}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Chip
                  label={formatFileSize(file.size)}
                  variant="standard"
                  color="default"
                  size="sm"
                />
                {file.type && (
                  <Chip
                    label={`.${file.type.toLowerCase()}`}
                    variant="standard"
                    color="default"
                    size="sm"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleOpen}
                aria-label="Abrir em nova aba"
                title="Abrir em nova aba"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDeleteClick}
                aria-label="Remover arquivo"
                title="Remover arquivo"
              >
                <Trash className="h-4 w-4 text-red-600 hover:text-red-700" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <ConfirmationDialog
        title="Remover arquivo"
        description="Tem certeza que deseja remover este arquivo? Essa ação não pode ser desfeita."
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onAccept={handleDelete}
        labelAccept={isDeleting ? "Removendo..." : "Remover"}
        labelDeny="Cancelar"
      />
    </Card>
  );
}
