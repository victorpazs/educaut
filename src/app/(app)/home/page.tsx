"use client";

import { PageHeader } from "@/components/page-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Calendar, FileText, Users } from "lucide-react";

import { QuickAccess } from "./_components/QuickAccess";
import { TotalizerCard } from "./_components/TotalizerCard";
import { TotalizerCardSkeleton } from "./_components/TotalizerCardSkeleton";
import { useInsights } from "./_hooks/use-insights";

export default function DashboardPage() {
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
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Bem vindo, educador!"
            subtitle="Gerencie suas aulas, atividades e agenda de forma simples e prática."
          />
        </div>

        {isLoading
          ? Array.from({ length: totalizers.length }).map((_, index) => (
              <div
                key={`insight-skeleton-${index}`}
                className="col-span-12 md:col-span-6 lg:col-span-4"
              >
                <TotalizerCardSkeleton />
              </div>
            ))
          : totalizers.map((item) => (
              <div
                key={item.title}
                className="col-span-12 md:col-span-6 lg:col-span-4"
              >
                <TotalizerCard
                  title={item.title}
                  value={item.value}
                  icon={item.icon}
                />
              </div>
            ))}

        <QuickAccess />
      </div>
    </div>
  );
}
