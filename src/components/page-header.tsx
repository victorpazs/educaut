import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "./ui/button";

interface IPageHeader {
  title: string;
  subtitle: string;
  goBack?: () => void;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, goBack, actions }: IPageHeader) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
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
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {actions}
    </div>
  );
}
