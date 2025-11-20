import { ArrowRight, Calendar, FileCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";

type SearchOptionProps = {
  id: string;
  title: string;
  type: string;
  onClose: () => void;
};

const getIconByType = (type: string) => {
  switch (type) {
    case "student":
      return <User className="ml-2 h-4 w-4" />;
    case "calendar":
      return <Calendar className="ml-2 h-4 w-4" />;
    case "activity":
      return <FileCheck className="ml-2 h-4 w-4" />;
  }
};

const getLabelByType = (type: string) => {
  switch (type) {
    case "student":
      return "Aluno";
    case "calendar":
      return "Agendamento";
    case "activity":
      return "Atividade";
  }
};
export function SearchOption({ id, title, type, onClose }: SearchOptionProps) {
  const router = useRouter();
  const icon = getIconByType(type);

  const handleOptionClick = (id: string) => {
    switch (type) {
      case "student":
        router.push(`/students/edit/${id?.split(":")[1]}`);
        onClose();
        break;
      case "calendar":
        router.push(`/agenda?scheduleId=${id?.split(":")[1]}`);
        onClose();
        break;
      case "activity":
        router.push(`/activities/editor/${id?.split(":")[1]}`);
        onClose();
        break;
    }
  };
  return (
    <div
      onClick={() => handleOptionClick(id)}
      role="button"
      className="group cursor-pointer dark:hover:bg-tertiary hover:bg-gray-300/30 w-full flex items-center justify-between px-2 py-2 rounded-lg"
    >
      <div className="flex items-center gap-x-4">
        {icon}

        <div className="flex flex-col text-start">
          <span className="text-sm text-textLight dark:text-textDark font-medium">
            {title}
          </span>
          <span className="text-xs text-neutral-800 dark:text-slate-300">
            {getLabelByType(type)}
          </span>
        </div>
      </div>

      <div className="pointer-events-none flex flex-col items-center text-black opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out">
        <ArrowRight className="h-4 w-4" />
        <span className="mt-1 text-[10px] font-semibold  tracking-wide">
          Navegar
        </span>
      </div>
    </div>
  );
}
