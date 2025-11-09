import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ContentCard({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="flex items-center justify-between gap-4">
            <span className="text-lg font-medium">{title}</span>
            {actions && (
              <div className="flex items-center justify-end gap-3">
                {actions}
              </div>
            )}
          </div>
          <Separator className="my-3" />
        </div>
        <div className="col-span-12">{children}</div>
      </div>
    </Card>
  );
}
