import { jsPDF } from "jspdf";
import "svg2pdf.js";

export async function loadInitialState(
  fabricNS: any,
  canvas: any,
  initialState: unknown
): Promise<void> {
  if (!canvas || !initialState) return;
  const tryLoadJSON = async (jsonValue: unknown) => {
    try {
      canvas.loadFromJSON(jsonValue as any, () => {
        canvas.requestRenderAll();
      });
    } catch {}
  };
  const tryLoadSVG = async (svgString: string) => {
    try {
      const { objects, options } = await fabricNS.loadSVGFromString(svgString);
      const group = fabricNS.util.groupSVGElements(objects, options);
      canvas.clear();
      canvas.add(group);
      canvas.requestRenderAll();
    } catch {}
  };
  if (typeof initialState === "string") {
    const trimmed = initialState.trim();
    if (trimmed.startsWith("<svg")) {
      await tryLoadSVG(trimmed);
    } else {
      try {
        const parsed = JSON.parse(trimmed);
        await tryLoadJSON(parsed);
      } catch {}
    }
  } else if (typeof initialState === "object") {
    await tryLoadJSON(initialState);
  }
}

export function changeBackgroundColor(canvas: any, color: string): void {
  if (!canvas) return;
  canvas.set("backgroundColor", color);
  canvas.requestRenderAll();
}

export function addText(
  fabricNS: any,
  canvas: any,
  text: string,
  options?: Record<string, any>
): void {
  if (!canvas || !fabricNS) return;
  const itext = new fabricNS.IText(text, options ?? {});
  canvas.add(itext);
  canvas.setActiveObject(itext);
  canvas.requestRenderAll();
}

export function addImageFromDataURL(
  fabricNS: any,
  canvas: any,
  dataURL: string,
  options?: Record<string, any>
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!fabricNS || !canvas) return resolve(null);
    fabricNS.Image.fromURL(
      dataURL,
      (img: any) => {
        if (!img) return resolve(null);
        img.set(options ?? {});
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
        resolve(img);
      },
      { crossOrigin: "anonymous" }
    );
  });
}

export function addImageFromFile(
  fabricNS: any,
  canvas: any,
  file: File,
  options?: Record<string, any>
): Promise<any> {
  return new Promise((resolve) => {
    if (!file || !file.type?.startsWith?.("image/")) return resolve(null);
    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target?.result as string;
      const img = await addImageFromDataURL(fabricNS, canvas, data, options);
      resolve(img);
    };
    reader.readAsDataURL(file);
  });
}

export function toggleDrawing(
  canvas: any,
  isActive: boolean,
  brushColor = "#ff0000",
  brushWidth = 5
): void {
  if (!canvas) return;
  canvas.isDrawingMode = isActive;
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushWidth;
  }
}

export function setBrush(
  canvas: any,
  brushColor = "#ff0000",
  brushWidth = 5
): void {
  if (!canvas) return;
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushWidth;
  }
}

async function createVectorPdfFromCanvas(canvas: any): Promise<jsPDF | null> {
  if (!canvas) return null;
  const svgString = canvas.toSVG();
  const div = document.createElement("div");
  div.innerHTML = svgString;
  const svgElement = div.firstElementChild;
  if (!svgElement) return null;
  // Use canvas dimensions as PDF size
  const canvasW =
    (typeof canvas.getWidth === "function"
      ? canvas.getWidth()
      : canvas.width) || 800;
  const canvasH =
    (typeof canvas.getHeight === "function"
      ? canvas.getHeight()
      : canvas.height) || 600;
  const orientation = canvasW >= canvasH ? "l" : "p";
  const pdf = new jsPDF({
    orientation: orientation as any,
    unit: "px",
    format: [canvasW, canvasH],
  } as any);
  const pdfW = canvasW;
  const pdfH = canvasH;
  await (pdf as any).svg(
    svgElement as any,
    {
      x: 0,
      y: 0,
      width: pdfW,
      height: pdfH,
    } as any
  );
  return pdf;
}

export async function exportVectorPDF(
  canvas: any,
  filename = "meu-design-vetorial.pdf"
): Promise<void> {
  const pdf = await createVectorPdfFromCanvas(canvas);
  if (!pdf) return;
  pdf.save(filename);
}

export async function printVectorPDF(canvas: any): Promise<void> {
  const pdf = await createVectorPdfFromCanvas(canvas);
  if (!pdf) return;
  pdf.autoPrint();
  const blobUrl = pdf.output("bloburl");
  window.open(blobUrl, "_blank");
}

export function getSerializedState(canvas: any): unknown {
  if (!canvas) return null;
  return canvas.toJSON();
}

export function addLine(
  fabricNS: any,
  canvas: any,
  points: [number, number, number, number] = [50, 50, 200, 50],
  options?: Record<string, any>
): void {
  if (!fabricNS || !canvas) return;
  const line = new fabricNS.Line(points, {
    stroke: "#111",
    strokeWidth: 2,
    selectable: true,
    ...options,
  });
  canvas.add(line);
  canvas.setActiveObject(line);
  canvas.requestRenderAll();
}

export function addRect(
  fabricNS: any,
  canvas: any,
  options?: Record<string, any>
): void {
  if (!fabricNS || !canvas) return;
  const rect = new fabricNS.Rect({
    left: 100,
    top: 100,
    width: 120,
    height: 80,
    fill: "transparent",
    stroke: "#111",
    strokeWidth: 2,
    ...options,
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
}

export function addCircle(
  fabricNS: any,
  canvas: any,
  options?: Record<string, any>
): void {
  if (!fabricNS || !canvas) return;
  const circle = new fabricNS.Circle({
    left: 150,
    top: 150,
    radius: 50,
    fill: "transparent",
    stroke: "#111",
    strokeWidth: 2,
    ...options,
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.requestRenderAll();
}
