"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useCanvasEditor } from "./context";
import { Download, Printer } from "lucide-react";

type ActionsProps = {
  className?: string;
};

export default function Actions({ className }: ActionsProps) {
  const { exportPDF, saveState, printPDF, name } = useCanvasEditor();
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <Button
        size="icon"
        aria-label="Baixar PDF"
        title="Baixar PDF"
        onClick={() => exportPDF(name)}
      >
        <Download className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        aria-label="Imprimir PDF"
        title="Imprimir PDF"
        onClick={() => printPDF()}
      >
        <Printer className="h-5 w-5" />
      </Button>
      <Button size="sm" onClick={saveState}>
        Save
      </Button>
    </div>
  );
}
