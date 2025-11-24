import { Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function DeleteButton({
  onClick,
  title,
  disabled,
}: {
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 text-red-600 hover:text-red-700"
          aria-label={title ?? "Excluir"}
          title={title ?? "Excluir"}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title ?? "Excluir"}</TooltipContent>
    </Tooltip>
  );
}
