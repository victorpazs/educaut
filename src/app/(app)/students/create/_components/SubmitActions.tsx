import { Button } from "@/components/ui/button";
import { StudentFormData } from "../_models";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";

interface SubmitActionsProps {
  formData: StudentFormData;
  currentStep: string;
  handleBack: () => void;
}

export function SubmitActions({
  formData,
  currentStep,
  handleBack,
}: SubmitActionsProps) {
  return (
    <div className="flex justify-end">
      <Card className="p-4 gap-2 mt-4 flex justify-end items-center w-auto">
        <Button variant="outline" onClick={handleBack}>
          Cancelar
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Salvar aluno
        </Button>
      </Card>
    </div>
  );
}
