"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ScheduleCreateSteps, ScheduleFormData } from "./_models";
import { ScheduleTabContent } from "../_components/ScheduleTabContent";
import { TabsSidebar } from "@/components/tabs-sidebar";
import { SubmitActions } from "./_components/SubmitActions";

export default function CreateSchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState<ScheduleCreateSteps>(
    ScheduleCreateSteps.BASIC_INFO
  );

  const getInitialDates = React.useCallback(() => {
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    const start = startParam ? new Date(startParam) : new Date();
    const end = endParam ? new Date(endParam) : new Date();

    return { start, end };
  }, [searchParams]);

  const [formData, setFormData] = React.useState<ScheduleFormData>(() => {
    const { start, end } = getInitialDates();
    return {
      title: "",
      description: "",
      start,
      end,
      studentId: null,
      activityIds: [],
    };
  });

  React.useEffect(() => {
    const { start, end } = getInitialDates();
    setFormData((prev) => ({
      ...prev,
      start,
      end,
    }));
  }, [getInitialDates]);

  const handleBack = React.useCallback(() => {
    router.push("/agenda");
  }, [router]);

  const options = React.useMemo(
    () => [
      {
        label: "Informações da aula",
        identifier: ScheduleCreateSteps.BASIC_INFO,
        icon: Calendar,
      },
      {
        label: "Horário",
        identifier: ScheduleCreateSteps.TIME_INFO,
        icon: Calendar,
      },
      {
        label: "Atividades trabalhadas",
        identifier: ScheduleCreateSteps.ACTIVITIES,
        icon: FileText,
      },
    ],
    []
  );

  const handleTabClick = React.useCallback((identifier: string) => {
    setActiveTab(identifier as ScheduleCreateSteps);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Nova aula"
            subtitle="Cadastre uma nova aula na agenda."
            goBack={handleBack}
          />
        </div>
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <TabsSidebar
            currentTab={activeTab}
            options={options?.map((opt) => ({
              ...opt,
              onClick: handleTabClick,
            }))}
          />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <ScheduleTabContent
            activeTab={activeTab}
            formData={formData}
            setFormData={setFormData}
          />

          <SubmitActions
            formData={formData}
            currentStep={activeTab}
            handleBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}
