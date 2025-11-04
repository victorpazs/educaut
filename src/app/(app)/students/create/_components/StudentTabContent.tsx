"use client";

import * as React from "react";

import {
  BasicInfoStep,
  ClinicalInfoStep,
  CharacteristicsStep,
  DifficultiesStep,
} from "./steps";
import { StudentFormData } from "../_models";

interface StudentTabContentProps {
  activeTab: string;
  formData: StudentFormData;
  onInputChange: (field: keyof StudentFormData, value: string) => void;
  onCheckboxChange: (
    field: keyof StudentFormData,
    option: string,
    checked: boolean
  ) => void;
}

export function StudentTabContent({
  activeTab,
  formData,
  onInputChange,
  onCheckboxChange,
}: StudentTabContentProps) {
  const renderStepContent = () => {
    switch (activeTab) {
      case "basic-info":
        return (
          <BasicInfoStep formData={formData} onInputChange={onInputChange} />
        );

      case "disorder":
        return (
          <ClinicalInfoStep
            formData={formData}
            onInputChange={onInputChange}
            onCheckboxChange={onCheckboxChange}
          />
        );

      case "hyperfocus":
        return (
          <CharacteristicsStep
            formData={formData}
            onCheckboxChange={onCheckboxChange}
          />
        );
      case "difficulty":
        return (
          <CharacteristicsStep
            formData={formData}
            onCheckboxChange={onCheckboxChange}
          />
        );

      case "preference":
        return (
          <DifficultiesStep
            formData={formData}
            onInputChange={onInputChange}
            onCheckboxChange={onCheckboxChange}
          />
        );
      case "potential":
        return (
          <DifficultiesStep
            formData={formData}
            onInputChange={onInputChange}
            onCheckboxChange={onCheckboxChange}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderStepContent()}</>;
}
