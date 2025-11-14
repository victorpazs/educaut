"use client";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loadInitialState,
  changeBackgroundColor,
  addText,
  addImageFromFile,
  toggleDrawing,
  exportVectorPDF,
  getSerializedState,
} from "@/lib/fabrics.utils";

type EditorCanvasProps = {
  initialState?: unknown; // JSON do Fabric (objeto ou string) ou SVG string
  onSave?: (state: unknown) => void;
  width?: number;
  height?: number;
  backgroundColor?: string;
};

export default function ActivityEditor({
  initialState,
  onSave,
  width = 800,
  height = 600,
  backgroundColor = "#f0f0f0",
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  // 1. Inicialização do Canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    let disposed = false;
    (async () => {
      const mod = await import("fabric");
      // Suporta diferentes formatos de export do pacote
      const f =
        (mod as any).fabric ??
        (mod as any).default?.fabric ??
        (mod as any).default ??
        mod;
      if (!f || !f.Canvas) return;
      fabricRef.current = f;
      if (disposed) return;
      // Inicializa o canvas do Fabric
      const fabricCanvas = new f.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor, // [7, 5, 8]
      });
      setCanvas(fabricCanvas);
    })();

    return () => {
      disposed = true;
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [width, height, backgroundColor]);
  useEffect(() => {
    if (!canvas) return;
    if (!initialState) return;

    void loadInitialState(fabricRef.current, canvas, initialState);
  }, [canvas, initialState]);

  const handleChangeBackgroundColor = (cor: string) => {
    if (canvas) {
      changeBackgroundColor(canvas, cor);
    }
  };

  const handleAddText = () => {
    if (canvas) {
      addText(fabricRef.current, canvas, "Arraste ou Edite", {
        left: 100,
        top: 100,
        fill: "#000000",
        fontSize: 24,
      });
    }
  };

  const handleAddImageFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (canvas) {
      const file = e.target.files?.[0];
      if (!file) return;
      void addImageFromFile(fabricRef.current, canvas, file, {
        left: 150,
        top: 150,
        scaleX: 0.5,
        scaleY: 0.5,
      });
    }
  };

  const handleToggleDrawing = (isAtivo: boolean) => {
    if (canvas) {
      toggleDrawing(canvas, isAtivo, "#ff0000", 5);
    }
  };

  const handleExportVectorPDF = async () => {
    if (!canvas) return;
    await exportVectorPDF(canvas, "meu-design-vetorial.pdf");
  };

  const handleSaveState = () => {
    if (!canvas) return;
    onSave?.(getSerializedState(canvas));
  };

  return (
    <div>
      {/* --- Controles --- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Label htmlFor="bg-color">Cor de Fundo</Label>
          <Input
            id="bg-color"
            type="color"
            onChange={(e) => handleChangeBackgroundColor(e.target.value)}
            className="w-10 h-10 p-1"
          />
          <Button onClick={handleAddText}>Adicionar Texto</Button>
          <Button variant="secondary" onClick={() => handleToggleDrawing(true)}>
            Desenhar
          </Button>
          <Button variant="outline" onClick={() => handleToggleDrawing(false)}>
            Mover (Desl. Desenho)
          </Button>
          <Label htmlFor="image">Imagem</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleAddImageFromInput}
          />
          <Button variant="ghost" onClick={handleSaveState}>
            Salvar
          </Button>
        </div>
      </div>

      {/* --- Botão de Exportar --- */}
      <div style={{ marginTop: "10px" }}>
        <Button onClick={handleExportVectorPDF}>
          Exportar para PDF (Alta Qualidade)
        </Button>
      </div>

      {/* --- O Canvas --- */}
      <div style={{ border: "1px solid black", marginTop: "10px" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
