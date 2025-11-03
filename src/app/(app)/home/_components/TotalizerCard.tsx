import { Card, CardContent } from "@/components/ui/card";

interface TotalizerCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const TotalizerCard = ({ title, value, icon }: TotalizerCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { TotalizerCard };
