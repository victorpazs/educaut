import { IActivityContent } from "@/app/(app)/activities/_models";
import { Card, CardContent } from "./ui/card";
import { CanvasPreview } from "./canvas-preview";
import { FilePreview } from "./school-files/FilePreview";
import { ActivitiesTags } from "./activities_tags";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  name: string;
  tags?: string[];
  canvasData?: IActivityContent["data"];
  uploadData?: { url: string; fileType: string };
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  height?: number;
}

export function ActivityCard({
  name,
  tags,
  canvasData,
  uploadData,
  actions,
  onClick,
  className,
  children,
  height,
}: ActivityCardProps) {
  return (
    <Card
      className={cn(
        "bg-background outline h-full outline-border hover:shadow-sm transition-shadow flex flex-col",
        className
      )}
      onClick={onClick}
    >
      <div className="w-full p-4 shrink-0">
        <div
          className={`w-full ${
            height ? `h-[${height}px]` : "h-[180px]"
          } rounded-lg overflow-hidden bg-muted`}
        >
          {canvasData ? (
            <CanvasPreview data={canvasData} />
          ) : uploadData ? (
            <FilePreview url={uploadData.url} type={uploadData.fileType} />
          ) : null}
        </div>
      </div>
      <CardContent className="pt-4 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="space-y-2 flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2 items-start">
              <div className="text-sm font-medium truncate" title={name}>
                {name}
              </div>
              {(tags?.length ?? 0) > 0 ? (
                <ActivitiesTags
                  selectedTags={tags ?? []}
                  parentTags={tags?.map((t) => ({ label: t, tag: t })) ?? []}
                />
              ) : null}
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
