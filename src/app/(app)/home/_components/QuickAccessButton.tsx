import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export type QuickAccessButtonProps = {
  icon: LucideIcon;
  label: string;
  path: string;
};

export function QuickAccessButton({
  icon: IconComponent,
  label,
  path,
}: QuickAccessButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(path);
  };

  return (
    <Card className="overflow-hidden">
      <Button
        variant="ghost"
        className="group relative flex h-auto w-full items-center gap-3 overflow-hidden py-6 px-4"
        onClick={handleClick}
      >
        <div className="flex w-full items-center gap-3 transition-all duration-200 ease-out group-hover:blur-xs group-hover:opacity-60">
          <Avatar className="bg-muted-foreground/80 h-10 w-10 rounded-lg border-none">
            <IconComponent className="h-6 w-6 text-white" />
          </Avatar>

          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-black opacity-0 transition-all duration-200 ease-out group-hover:opacity-100">
          <ArrowRight className="h-4 w-4  text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-bold tracking-wide">
            Acessar
          </span>
        </div>
      </Button>
    </Card>
  );
}
