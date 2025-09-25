"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  User,
  Brain,
  Heart,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stepper, Step } from "@/components/ui/stepper";
import { StudentFormData } from "../_types";
import {
  BasicInfoStep,
  ClinicalInfoStep,
  CharacteristicsStep,
  DifficultiesStep,
} from "./steps";

const steps: Step[] = [
  {
    id: "basic",
    title: "Informações Básicas",
    description: "Nome, idade e segmento",
    icon: User,
  },
  {
    id: "clinical",
    title: "Informações Clínicas",
    description: "TEA e outros transtornos",
    icon: Brain,
  },
  {
    id: "characteristics",
    title: "Características",
    description: "Hiperfoco e preferências",
    icon: Heart,
  },
  {
    id: "difficulties",
    title: "Dificuldades",
    description: "Dificuldades identificadas",
    icon: Eye,
  },
];

interface StudentStepperProps {
  onSubmit?: (formData: StudentFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<StudentFormData>;
}

export function StudentStepper({
  onSubmit,
  onCancel,
  initialData = {},
}: StudentStepperProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState<StudentFormData>({
    name: "",
    segment: "",
    age: "",
    tea: "",
    otherDisorders: [],
    hyperfocus: [],
    communication: "",
    preferences: [],
    difficulties: [],
    observation: "",
    ...initialData,
  });

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (
    field: keyof StudentFormData,
    option: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[];
      const newArray = checked
        ? [...currentArray, option]
        : currentArray.filter((item) => item !== option);

      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default behavior
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Creating student:", formData);
        router.push("/students");
      }
    } catch (error) {
      console.error("Error creating student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/students");
    }
  };

  const isStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Basic Info
        return !!(formData.name && formData.age && formData.segment);
      case 1: // Clinical Info
        return !!(formData.tea && formData.communication);
      case 2: // Characteristics
        return true; // Optional fields
      case 3: // Difficulties
        return true; // Optional fields
      default:
        return false;
    }
  };

  const canProceed = isStepValid(currentStep);
  const isLastStep = currentStep === steps.length - 1;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );

      case 1:
        return (
          <ClinicalInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
          />
        );

      case 2:
        return (
          <CharacteristicsStep
            formData={formData}
            onCheckboxChange={handleCheckboxChange}
          />
        );

      case 3:
        return (
          <DifficultiesStep
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <Card>
        <CardContent className="pt-6">
          <Stepper steps={steps} currentStep={currentStep} />
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[400px] lg:min-h-[500px]">{renderStepContent()}</div>

      {/* Navigation Buttons - Responsive positioning */}
      <div className="sticky bottom-0 z-50 lg:relative lg:bottom-auto lg:z-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          <Card className="backdrop-blur-sm bg-white/95 shadow-lg lg:shadow-none lg:bg-transparent lg:border-none">
            <CardContent className="p-4 lg:p-0">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isLoading}
                  className="w-full sm:w-auto min-w-[120px] order-2 sm:order-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                {isLastStep ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full sm:w-auto min-w-[120px] order-1 sm:order-2"
                  >
                    {isLoading ? (
                      "Criando..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Criar Aluno
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed || isLoading}
                    className="w-full sm:w-auto min-w-[120px] order-1 sm:order-2"
                  >
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Spacer for mobile sticky buttons */}
      <div className="h-4 lg:hidden"></div>
    </div>
  );
}