import { File, FileAudio, FileImage, FileText, FileVideo } from "lucide-react";

export function getIconByType(type: string | undefined) {
  const normalized = (type || "").toLowerCase();
  if (normalized.startsWith("image/")) return FileImage;
  if (normalized.startsWith("video/")) return FileVideo;
  if (normalized.startsWith("audio/")) return FileAudio;
  if (
    normalized.includes("pdf") ||
    normalized.includes("text") ||
    normalized.includes("msword") ||
    normalized.includes("officedocument")
  )
    return FileText;
  return File;
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}
