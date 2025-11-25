import { File, FileAudio, FileImage, FileText, FileVideo } from "lucide-react";

export function getIconByType(type: string | undefined) {
  const normalized = (type || "").toLowerCase();

  // Verificar MIME types
  if (normalized.startsWith("image/")) return FileImage;
  if (normalized.startsWith("video/")) return FileVideo;
  if (normalized.startsWith("audio/")) return FileAudio;

  // Verificar extensões de imagem
  if (
    normalized === "png" ||
    normalized === "jpg" ||
    normalized === "jpeg" ||
    normalized === "webp" ||
    normalized === "gif" ||
    normalized === "svg"
  )
    return FileImage;

  // Verificar extensões de vídeo
  if (
    normalized === "mp4" ||
    normalized === "webm" ||
    normalized === "ogg" ||
    normalized === "avi" ||
    normalized === "mov"
  )
    return FileVideo;

  // Verificar extensões de áudio
  if (
    normalized === "mp3" ||
    normalized === "wav" ||
    normalized === "ogg" ||
    normalized === "aac" ||
    normalized === "flac"
  )
    return FileAudio;

  // Verificar documentos
  if (
    normalized.includes("pdf") ||
    normalized.includes("text") ||
    normalized.includes("msword") ||
    normalized.includes("officedocument") ||
    normalized === "doc" ||
    normalized === "docx" ||
    normalized === "xls" ||
    normalized === "xlsx" ||
    normalized === "ppt" ||
    normalized === "pptx" ||
    normalized === "txt"
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
