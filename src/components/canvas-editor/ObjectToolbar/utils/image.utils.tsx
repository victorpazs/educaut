/* eslint-disable @typescript-eslint/no-explicit-any */
export function getScaledSize(object: any): { width: number; height: number } {
  const width = Number(object?.getScaledWidth?.() ?? object?.width ?? 0) || 0;
  const height =
    Number(object?.getScaledHeight?.() ?? object?.height ?? 0) || 0;
  return { width, height };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function reapplyScaleToMatchSize(
  object: any,
  targetWidth: number,
  targetHeight: number,
): void {
  const naturalW = Number(object?.width ?? 0) || 0;
  const naturalH = Number(object?.height ?? 0) || 0;
  if (naturalW > 0 && naturalH > 0 && targetWidth > 0 && targetHeight > 0) {
    object.scaleX = targetWidth / naturalW;
    object.scaleY = targetHeight / naturalH;
  }
}

function isSameOrigin(url: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const u = new URL(url, window.location.origin);
    return u.origin === window.location.origin;
  } catch {
    return true;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function ensureRender(object: any, canvas?: any): void {
  object?.setCoords?.();
  canvas?.requestRenderAll?.();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function ensureImageAutoRender(object: any, canvas?: any): void {
  const el: HTMLImageElement | undefined = object?._element;
  if (!el) return;
  const FLAG = "_autoRenderOnLoadAttached";
  if ((object as any)[FLAG]) return;
  el.addEventListener("load", () => {
    canvas?.requestRenderAll?.();
  });
  (object as any)[FLAG] = true;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function setObjectImageFromDataUrl(
  object: any,
  dataUrl: string,
  canvas?: any,
): Promise<void> {
  if (!object || !dataUrl) return;
  const { width: prevW, height: prevH } = getScaledSize(object);
  ensureImageAutoRender(object, canvas);
  if (typeof object.setSrc === "function") {
    const loadOptions = isSameOrigin(dataUrl)
      ? undefined
      : { crossOrigin: "anonymous" as const };
    await Promise.resolve(object.setSrc(dataUrl, loadOptions));
    reapplyScaleToMatchSize(object, prevW, prevH);
    (object as any).imageUrl = dataUrl;
    ensureRender(object, canvas);
  } else if (typeof object.setElement === "function") {
    await new Promise<void>((resolve) => {
      const imgEl = new Image();
      (imgEl as any).crossOrigin = "anonymous";
      imgEl.onload = () => {
        object.setElement(imgEl);
        ensureImageAutoRender(object, canvas);
        reapplyScaleToMatchSize(object, prevW, prevH);
        (object as any).imageUrl = dataUrl;
        ensureRender(object, canvas);
        resolve();
      };
      imgEl.src = dataUrl;
    });
  } else if (object?._element) {
    // Fallback: direct src change, auto-render will handle refresh
    const el = object._element as HTMLImageElement;
    el.src = dataUrl;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function openImageFilePickerAndReplace(object: any, canvas?: any): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";
  document.body.appendChild(input);
  input.onchange = async () => {
    try {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = String(reader.result ?? "");
        if (!dataUrl) return;
        await setObjectImageFromDataUrl(object, dataUrl, canvas);
      };
      reader.readAsDataURL(file);
    } finally {
      document.body.removeChild(input);
    }
  };
  input.click();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function applyCornerRadiusToImage(
  object: any,
  fabricNS: any,
  canvas: any,
  radius: number,
): void {
  if (!object) return;
  try {
    if (!radius || radius <= 0) {
      object.clipPath = undefined;
      object._cornerRadius = 0;
    } else {
      // Use natural (unscaled) dimensions for clipPath, positioned at top-left
      const naturalW =
        Number(object?.width ?? 0) || Number(object?.getScaledWidth?.() ?? 0);
      const naturalH =
        Number(object?.height ?? 0) || Number(object?.getScaledHeight?.() ?? 0);
      if (fabricNS?.Rect && naturalW > 0 && naturalH > 0) {
        const clip = new fabricNS.Rect({
          width: naturalW,
          height: naturalH,
          rx: radius,
          ry: radius,
          left: 0,
          top: 0,
          originX: "left",
          originY: "top",
        });
        // Ensure clipPath is relative to the object
        (clip as any).absolutePositioned = false;
        object.clipPath = clip;
        object._cornerRadius = radius;
      }
    }
    // Mark object dirty so Fabric recalculates cache with new clipPath
    object.dirty = true;
    ensureRender(object, canvas);
  } catch {
    // no-op
  }
}
