import { Button } from "@/components/ui/button";
import { StudentFormData, StudentCreateSchema } from "../_models";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { withValidation } from "@/lib/validation";
import { toast } from "@/lib/toast";
import { createStudentAction } from "../actions";

interface SubmitActionsProps {
  formData: StudentFormData;
  currentStep: string;
  handleBack: () => void;
}

export function SubmitActions({ formData, handleBack }: SubmitActionsProps) {
  const handleCreate = withValidation(StudentCreateSchema, async () => {
    const res = await createStudentAction(formData);
    if (!res.success) {
      toast.error("Erro", res.message || "Não foi possível criar o aluno.");
      return;
    }
    toast.success("Sucesso", "Aluno criado com sucesso.");
    handleBack();
  });

  return (
    <div className="flex justify-end">
      <Card className="p-4 gap-2 mt-4 flex justify-end items-center w-auto">
        <Button variant="outline" onClick={handleBack}>
          Cancelar
        </Button>
        <Button onClick={() => handleCreate(formData)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Criar aluno
        </Button>
      </Card>
    </div>
  );
}
