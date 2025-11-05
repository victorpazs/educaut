import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface IPageHeader {
  title: string;
  titleSize?: "sm" | "md" | "lg";
  subtitle?: string;
  goBack?: () => void;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  titleSize = "md",
  subtitle,
  goBack,
  actions,
}: IPageHeader) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        subtitle ? "mb-4" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {!!goBack ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-10 w-10" />
          </Button>
        ) : null}
        <div className="flex flex-col">
          <h1
            className={cn(
              "font-semibold text-foreground",
              titleSize === "sm"
                ? "text-lg md:text-lg"
                : titleSize === "md"
                ? "text-xl md:text-xl"
                : "text-2xl md:text-2xl"
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground md:text-base text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions}
    </div>
  );
}
