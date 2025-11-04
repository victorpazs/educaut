import { ChevronRight } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  const renderedSteps: ReactNode[] = [];

  steps.forEach((step, index) => {
    const isCompleted = index < currentStep;
    const isCurrent = index === currentStep;
    const isUpcoming = index > currentStep;

    renderedSteps.push(
      <li
        key={`step-${step.id}`}
        className="flex flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center"
      >
        <div className="flex items-start sm:items-center">
          <div className="ml-3 min-w-0 flex-1">
            <p
              className={cn(
                "text-sm transition-colors",
                isCurrent && "font-bold",
                isCompleted && "text-muted-foreground",
                isUpcoming && "text-secondary"
              )}
            >
              {step.title}
            </p>
          </div>
        </div>
      </li>
    );

    if (index < steps.length - 1) {
      renderedSteps.push(
        <li
          key={`separator-${step.id}`}
          aria-hidden="true"
          className="flex items-center justify-center py-2 sm:flex-none sm:px-4 sm:py-0"
        >
          <ChevronRight
            className={cn(
              "hidden h-5 w-5 transition-colors sm:block",
              index < currentStep && "text-primary",
              index >= currentStep && "text-muted-foreground"
            )}
          />
          <ChevronRight
            className={cn(
              "block h-5 w-5 rotate-90 self-center transition-colors sm:hidden",
              index < currentStep && "text-primary",
              index >= currentStep && "text-muted-foreground"
            )}
          />
        </li>
      );
    }
  });

  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Progress">
        <ol className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
          {renderedSteps}
        </ol>
      </nav>
    </div>
  );
}
