import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, Calendar } from "lucide-react";
import { QuickAccessButton, QuickAccessButtonProps } from "./QuickAccessButton";

const quickAccessButtons: QuickAccessButtonProps[] = [
  {
    icon: <User className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />,
    label: "Novo Aluno",
    path: "/students/create",
  },
  {
    icon: (
      <FileText className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
    ),
    label: "Nova Atividade",
    path: "/activities/create",
  },

  {
    icon: (
      <Calendar className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
    ),
    label: "Nova Aula",
    path: "/agenda/create",
  },
];
export const QuickAccess = () => {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3">
      <div className="flex flex-col gap-3">
        {quickAccessButtons.map((button) => (
          <QuickAccessButton key={button.label} {...button} />
        ))}
      </div>
    </div>
  );
};
