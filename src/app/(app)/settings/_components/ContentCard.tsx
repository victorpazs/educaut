import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ContentCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <span className="text-lg font-medium">{title}</span>
          <Separator className="my-3" />
        </div>
        {children}
      </div>
    </Card>
  );
}
