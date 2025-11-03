import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        className="justify-start gap-3 h-auto w-full py-4"
        onClick={handleClick}
      >
        <div className="h-10 w-10 rounded-full bg-[hsl(var(--chart-1))] flex items-center justify-center flex-shrink-0">
          {IconComponent}
        </div>
        <span className="text-sm">{label}</span>
      </Button>
    </Card>
  );
}
