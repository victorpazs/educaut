"use client";

import * as React from "react";
import { BasicInfoStep, ActivitiesStep, TimeStep } from "./steps";
import { ScheduleFormData, ScheduleCreateSteps } from "../create/_models";
import { ContentCard } from "@/components/content-card";

interface ScheduleTabContentProps {
  activeTab: string;
  formData: ScheduleFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScheduleFormData>>;
  scheduleId?: number | null;
}

export function ScheduleTabContent({
  activeTab,
  formData,
  setFormData,
  scheduleId,
}: ScheduleTabContentProps) {
  function onInputChange<T>(
    field: keyof ScheduleFormData | (keyof ScheduleFormData)[],
    value: T | T[]
  ) {
    if (Array.isArray(field) && Array.isArray(value)) {
      setFormData((prev) => {
        const next: ScheduleFormData = { ...prev };
        const fields = field as (keyof ScheduleFormData)[];
        const values = value as unknown[];
        fields.forEach((f, idx) => {
          (next as Record<keyof ScheduleFormData, unknown>)[f] = values[idx];
        });
        return next;
      });
      return;
    }

    if (!Array.isArray(field)) {
      const key = field as keyof ScheduleFormData;
      setFormData(
        (prev) => ({ ...prev, [key]: value as unknown } as ScheduleFormData)
      );
    }
  }

  const onDateChange = (field: keyof ScheduleFormData, value: Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  function onActivityChange(activityId: number, value: boolean) {
    const currentActivities = formData.activityIds || [];
    const updatedActivities = value
      ? [...currentActivities, activityId]
      : currentActivities.filter((id) => id !== activityId);
    setFormData((prev) => ({
      ...prev,
      activityIds: updatedActivities,
    }));
  }

  const getStepTitle = (step: string) => {
    switch (step) {
      case ScheduleCreateSteps.BASIC_INFO:
        return "Informações da aula";
      case ScheduleCreateSteps.TIME_INFO:
        return "Horário";
      case ScheduleCreateSteps.ACTIVITIES:
        return "Atividades";
      default:
        return "";
    }
  };

  const getStepSubtitle = (step: string) => {
    switch (step) {
      case ScheduleCreateSteps.BASIC_INFO:
        return "Preencha os dados principais da aula";
      case ScheduleCreateSteps.TIME_INFO:
        return "Defina o horário de início e fim da aula";
      case ScheduleCreateSteps.ACTIVITIES:
        return "Selecione as atividades que serão realizadas nesta aula";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (activeTab) {
      case ScheduleCreateSteps.BASIC_INFO:
        return (
          <BasicInfoStep formData={formData} onInputChange={onInputChange} />
        );
      case ScheduleCreateSteps.TIME_INFO:
        return <TimeStep formData={formData} onDateChange={onDateChange} />;

      case ScheduleCreateSteps.ACTIVITIES:
        return (
          <ActivitiesStep
            formData={formData}
            onActivityChange={onActivityChange}
            scheduleId={scheduleId}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ContentCard
      title={getStepTitle(activeTab)}
      subtitle={getStepSubtitle(activeTab)}
    >
      {renderStepContent()}
    </ContentCard>
  );
}
