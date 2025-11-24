import { Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function EditButton({
  onClick,
  title,
}: {
  onClick?: () => void;
  title?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0"
          onClick={onClick}
          aria-label={title ?? "Editar"}
          title={title ?? "Editar"}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title ?? "Editar"}</TooltipContent>
    </Tooltip>
  );
}
