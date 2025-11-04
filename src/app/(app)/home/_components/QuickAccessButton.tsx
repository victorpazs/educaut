import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export type QuickAccessButtonProps = {
  icon: React.ReactNode;
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
    <Card className="overflow-hidden rounded-lg">
      <Button
        variant="ghost"
        className="group relative flex h-auto w-full items-center gap-3 overflow-hidden py-6 px-4"
        onClick={handleClick}
      >
        <div className="flex w-full items-center gap-3 transition-all duration-200 ease-out group-hover:blur-xs group-hover:opacity-60">
          {IconComponent}

          <span className="text-sm">{label}</span>
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-black opacity-0 transition-all duration-200 ease-out group-hover:opacity-100">
          <ArrowRight className="h-4 w-4" />
          <span className="text-xs font-semibold tracking-wide">Acessar</span>
        </div>
      </Button>
    </Card>
  );
}
