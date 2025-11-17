"use client";
import React from "react";
import { useCanvasEditor } from "./context";
import {
  Download,
  Printer,
  Save,
  Loader2,
  LoaderIcon,
  CloudUpload,
} from "lucide-react";
import IconButton from "../ui/icon-button";
import { Button } from "../ui/button";
import { getAge } from "@/lib/utils";

type ActionsProps = {
  className?: string;
};

export default function Actions({ className }: ActionsProps) {
  const { exportPDF, saveState, printPDF, name, isSaving, lastSavedAt } =
    useCanvasEditor();

  const formatElapsed = React.useCallback((date: Date | null) => {
    if (!date) return "poucos segundos";
    const nowMs = Date.now();
    const thenMs = date.getTime();
    const diffMs = Math.max(0, nowMs - thenMs);
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) {
      return "poucos segundos";
    }
    const min = Math.floor(sec / 60);
    if (min < 60) {
      return min === 1 ? "1 minuto" : `${min} minutos`;
    }
    const hrs = Math.floor(min / 60);
    if (hrs < 24) {
      return hrs === 1 ? "1 hora" : `${hrs} horas`;
    }
    return getAge(date) ?? "—";
  }, []);
  const savedAgo = `Alterações salvas há ${formatElapsed(lastSavedAt)}`;
  const statusText = isSaving ? "Salvando as alterações..." : savedAgo;

  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        size="sm"
        className="flex items-center h-7 px-2! gap-2 font-normal! text-start! justify-start! text-secondary"
        disabled={isSaving}
        variant="ghost"
      >
        {isSaving ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : (
          <CloudUpload className="h-4 w-4" />
        )}
        {statusText}
      </Button>
      <div className={`flex items-center gap-3 ${className ?? ""}`}>
        <IconButton
          className="border-none!"
          aria-label="Baixar PDF"
          title="Baixar PDF"
          onClick={() => exportPDF(name)}
          icon={<Download className="h-4 w-4" />}
        />
        <IconButton
          className="border-none!"
          aria-label="Imprimir PDF"
          title="Imprimir PDF"
          onClick={() => printPDF()}
          icon={<Printer className="h-4 w-4" />}
        />
        <IconButton
          className="border-none!"
          aria-label="Salvar estado"
          title="Salvar estado"
          onClick={() => saveState()}
          disabled={isSaving}
          icon={
            isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )
          }
        />
      </div>
    </div>
  );
}
