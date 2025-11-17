import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { getIconByType, formatFileSize } from "./utils";

type FileCellProps = {
  file: {
    id: number;
    type: string;
    size: number;
    url: string;
    status: number | null;
    created_at: Date | string | null;
  };
};

export function FileCell({ file }: FileCellProps) {
  const Icon = getIconByType(file.type);
  const createdAt =
    file.created_at instanceof Date
      ? file.created_at
      : file.created_at
      ? new Date(file.created_at)
      : null;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{file.url}</span>
          {file.type && <Badge variant="secondary">{file.type}</Badge>}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <Separator orientation="vertical" className="h-3" />
          {createdAt && <span>{formatDate(createdAt)}</span>}
        </div>
      </div>
      <div className="shrink-0">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => window.open(file.url, "_blank", "noopener,noreferrer")}
          aria-label="Baixar arquivo"
          title="Baixar arquivo"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
