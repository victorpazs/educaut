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
  const textbox = new fabricNS.Textbox(text, {
    width: 240,
    editable: true,
    ...options,
  });
  textbox.on("scaling", () => {
    try {
      const nextWidth =
        typeof textbox.width === "number" && typeof textbox.scaleX === "number"
          ? textbox.width * textbox.scaleX
          : textbox.getScaledWidth?.();
      if (typeof nextWidth === "number" && isFinite(nextWidth)) {
        textbox.set({
          width: Math.max(20, nextWidth),
          scaleX: 1,
          scaleY: 1,
        });
        textbox.setCoords?.();
      }
    } catch {
      // no-op
    }
    canvas.requestRenderAll?.();
  });
  canvas.add(textbox);
  canvas.setActiveObject(textbox);
  canvas.requestRenderAll();
}

export function addImageFromDataURL(
  fabricNS: any,
  canvas: any,
  dataURL: string,
  options?: Record<string, any>
): Promise<any> {
  return new Promise(async (resolve) => {
    if (!fabricNS || !canvas) return resolve(null);
    let loadOptions: any = undefined;
    try {
      if (typeof window !== "undefined" && typeof dataURL === "string") {
        const isData = dataURL.startsWith("data:");
        const isRelative = dataURL.startsWith("/");
        const isHttp =
          dataURL.startsWith("http://") || dataURL.startsWith("https://");
        if (!isData) {
          if (isRelative) {
            loadOptions = undefined;
          } else if (isHttp) {
            const u = new URL(dataURL);
            const sameOrigin = u.origin === window.location.origin;
            loadOptions = sameOrigin ? undefined : { crossOrigin: "anonymous" };
          }
        }
      }
    } catch {
      loadOptions = undefined;
    }
    try {
      // Prefer API moderna do Fabric 6: FabricImage.fromURL(url, loadOptions?, imageOptions?)
      const ImageKlass =
        (fabricNS as any).FabricImage ?? (fabricNS as any).Image;
      if (ImageKlass?.fromURL && (fabricNS as any).FabricImage) {
        const img = await ImageKlass.fromURL(
          dataURL,
          loadOptions,
          options ?? {}
        );
        if (!img) return resolve(null);
        // Salva URL usada
        (img as any).imageUrl = dataURL;
        if (options) img.set(options);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll?.();
        return resolve(img);
      }
      // Fallback: API com callback
      (fabricNS as any).Image.fromURL(
        dataURL,
        (img: any) => {
          if (!img) return resolve(null);
          (img as any).imageUrl = dataURL;
          img.set(options ?? {});
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.requestRenderAll?.();
          resolve(img);
        },
        loadOptions
      );
    } catch {
      resolve(null);
    }
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
      if (img) {
        (img as any).imageUrl = data;
        canvas.requestRenderAll?.();
      }
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
  // Inclui propriedades customizadas relevantes
  return canvas.toJSON(["imageUrl"]);
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
