import { Calendar, FileText, Users } from "lucide-react";
import { useInsights } from "../_hooks/use-insights";
import { TotalizerCardSkeleton } from "./TotalizerCardSkeleton";
import { TotalizerCard } from "./TotalizerCard";

export function HomeTotalizers() {
  const { insights, isLoading } = useInsights();

  const totalizers = [
    {
      title: "Total de alunos",
      value: insights?.totalStudents ?? 0,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Total de atividades",
      value: insights?.totalActivities ?? 0,
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Aulas da semana",
      value: insights?.weeklyClasses ?? 0,
      icon: <Calendar className="h-6 w-6" />,
    },
  ];

  return (
    <>
      {isLoading
        ? Array.from({ length: totalizers.length }).map((_, index) => (
            <div
              key={`insight-skeleton-${index}`}
              className="col-span-12 md:col-span-6 lg:col-span-3"
            >
              <TotalizerCardSkeleton />
            </div>
          ))
        : totalizers.map((item) => (
            <div
              key={item.title}
              className="col-span-12 md:col-span-6 lg:col-span-3"
            >
              <TotalizerCard
                title={item.title}
                value={item.value}
                icon={item.icon}
              />
            </div>
          ))}
    </>
  );
}
