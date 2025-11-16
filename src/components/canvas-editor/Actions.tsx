"use client";
import React from "react";
import { useCanvasEditor } from "./context";
import { Download, Printer, Save, Loader2 } from "lucide-react";
import IconButton from "../ui/icon-button";

type ActionsProps = {
  className?: string;
};

export default function Actions({ className }: ActionsProps) {
  const { exportPDF, saveState, printPDF, name, isSaving } = useCanvasEditor();
  return (
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
  );
}
