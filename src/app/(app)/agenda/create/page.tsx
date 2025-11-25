"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ScheduleCreateSteps, ScheduleFormData } from "./_models";
import { ScheduleTabContent } from "../_components/ScheduleTabContent";
import { TabsSidebar } from "@/components/tabs-sidebar";
import { SubmitActions } from "./_components/SubmitActions";
import { useAgenda } from "../_hooks/use-agenda";

export default function CreateSchedulePage() {
  const { refetch } = useAgenda();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState<ScheduleCreateSteps>(
    ScheduleCreateSteps.BASIC_INFO
  );

  const startParamValue = searchParams.get("start");
  const endParamValue = searchParams.get("end");

  const startParamRef = React.useRef(startParamValue);
  const endParamRef = React.useRef(endParamValue);

  const getInitialDates = React.useCallback(() => {
    const start = startParamValue ? new Date(startParamValue) : new Date();
    const end = endParamValue ? new Date(endParamValue) : new Date();
    return { start, end };
  }, [startParamValue, endParamValue]);

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
    // Only update if the actual values changed
    if (
      startParamRef.current === startParamValue &&
      endParamRef.current === endParamValue
    ) {
      return;
    }

    startParamRef.current = startParamValue;
    endParamRef.current = endParamValue;

    if (!startParamValue && !endParamValue) return;

    const start = startParamValue ? new Date(startParamValue) : null;
    const end = endParamValue ? new Date(endParamValue) : null;

    if (start && end) {
      setFormData((prev) => {
        // Only update if dates actually changed
        const prevStartTime = prev.start.getTime();
        const prevEndTime = prev.end.getTime();
        const newStartTime = start.getTime();
        const newEndTime = end.getTime();

        if (prevStartTime !== newStartTime || prevEndTime !== newEndTime) {
          return {
            ...prev,
            start,
            end,
          };
        }
        return prev;
      });
    }
  }, [startParamValue, endParamValue]);

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
        label: "Atividades",
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
