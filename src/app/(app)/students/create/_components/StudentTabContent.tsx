"use client";

import * as React from "react";
import { BasicInfoStep, AttributesStep } from "./steps";
import { StudentFormData } from "../_models";
import { PageHeader } from "@/components/page-header";
import { getAttributeLabel } from "@/lib/attributes.utils";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAttributes } from "@/hooks/useAttributes";
import { ContentCard } from "@/components/content-card";

interface StudentTabContentProps {
  activeTab: string;
  formData: StudentFormData;
  setFormData: React.Dispatch<React.SetStateAction<StudentFormData>>;
}

export function StudentTabContent({
  activeTab,
  formData,
  setFormData,
}: StudentTabContentProps) {
  const { attributesByType } = useAttributes();

  function onInputChange<T>(
    field: keyof StudentFormData | (keyof StudentFormData)[],
    value: T | T[]
  ) {
    if (Array.isArray(field) && Array.isArray(value)) {
      setFormData((prev) => {
        const next = { ...prev } as StudentFormData;
        field.forEach((f, idx) => {
          (next as any)[f] = (value as T[])[idx] as any;
        });
        return next;
      });
      return;
    }

    if (!Array.isArray(field)) {
      setFormData((prev) => ({
        ...prev,
        [field]: value as T,
      }));
    }
  }

  const onBooleanChange = (field: keyof StudentFormData, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onDateChange = (field: keyof StudentFormData, value: Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  function onAttributeChange(attribute_id: number, value: boolean) {
    const currentAttributes = formData.student_attributes || [];
    const updatedAttributes = value
      ? [...currentAttributes, attribute_id]
      : currentAttributes.filter((id) => id !== attribute_id);
    setFormData((prev) => ({
      ...prev,
      student_attributes: updatedAttributes,
    }));
  }

  const renderStepContent = () => {
    switch (activeTab) {
      case "basic-info":
        return (
          <BasicInfoStep
            formData={formData}
            onInputChange={onInputChange}
            onCheckboxChange={onBooleanChange}
            onDateChange={onDateChange}
          />
        );

      case "disorder":
      case "hyperfocus":
      case "difficulty":
      case "potential":
        return (
          <AttributesStep
            formData={formData}
            attributeFields={attributesByType?.[activeTab] ?? []}
            onAttributeChange={onAttributeChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ContentCard title={getAttributeLabel(activeTab)}>
      {renderStepContent()}
    </ContentCard>
  );
}
