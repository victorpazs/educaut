import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Progress">
        <ol className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <li
                key={step.id}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-1"
              >
                <div className="flex items-start sm:items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                      isCurrent &&
                        "bg-primary border-primary text-primary-foreground",
                      isCompleted &&
                        "bg-primary border-primary text-primary-foreground",
                      isUpcoming &&
                        "bg-background border-muted-foreground text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isCurrent && "text-primary",
                        isCompleted && "text-foreground",
                        isUpcoming && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p
                        className={cn(
                          "text-xs transition-colors",
                          isCurrent && "text-primary",
                          (isCompleted || isUpcoming) && "text-muted-foreground"
                        )}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight
                    className={cn(
                      "hidden w-5 h-5 mx-2 transition-colors sm:block",
                      index < currentStep && "text-primary",
                      index >= currentStep && "text-muted-foreground"
                    )}
                  />
                )}
                {index < steps.length - 1 && (
                  <ChevronRight
                    className={cn(
                      "block h-5 w-5 self-center transition-colors sm:hidden",
                      index < currentStep && "text-primary",
                      index >= currentStep && "text-muted-foreground",
                      "rotate-90"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
