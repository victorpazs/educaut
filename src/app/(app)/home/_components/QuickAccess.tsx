import { User, FileText, Calendar, School, Settings, Tag } from "lucide-react";
import { QuickAccessButton, QuickAccessButtonProps } from "./QuickAccessButton";

const quickAccessButtons: QuickAccessButtonProps[] = [
  {
    icon: User,
    label: "Novo Aluno",
    path: "/students/create",
  },
  {
    icon: FileText,
    label: "Nova Atividade",
    path: "/activities",
  },

  {
    icon: Calendar,
    label: "Nova Aula",
    path: "/agenda/create",
  },
  {
    icon: Settings,
    label: "Meu cadastro",
    path: "/settings/profile",
  },
  {
    icon: School,
    label: "Minhas escolas",
    path: "/settings/schools",
  },
  {
    icon: Tag,
    label: "Características de alunos",
    path: "/settings/attributes",
  },
];
export const QuickAccess = () => {
  return (
    <div className="flex flex-col gap-3">
      {quickAccessButtons.map((button) => (
        <QuickAccessButton key={button.label} {...button} />
      ))}
    </div>
  );
};
