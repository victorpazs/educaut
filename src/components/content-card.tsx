import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ContentCard({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-col text-start items-start">
              <span className="text-lg font-medium">{title}</span>
              {subtitle && (
                <span className="text-sm text-secondary">{subtitle}</span>
              )}
            </div>
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
