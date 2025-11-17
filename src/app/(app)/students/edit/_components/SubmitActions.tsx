import { Button } from "@/components/ui/button";
import {
  StudentFormData,
  StudentCreateSchema,
} from "@/app/(app)/students/create/_models";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { withValidation } from "@/lib/validation";
import { toast } from "@/lib/toast";
import { updateStudentAction } from "@/app/(app)/students/edit/[id]/actions";

interface SubmitActionsProps {
  studentId: number;
  formData: StudentFormData;
  currentStep: string;
  handleBack: () => void;
}

export function SubmitActions({
  studentId,
  formData,
  handleBack,
}: SubmitActionsProps) {
  const handleUpdate = withValidation(StudentCreateSchema, async () => {
    const res = await updateStudentAction(studentId, formData);
    if (!res.success) {
      toast.error("Erro", res.message || "Não foi possível atualizar o aluno.");
      return;
    }
    toast.success("Sucesso", "Aluno atualizado com sucesso.");
    handleBack();
  });

  return (
    <div className="flex justify-end">
      <Card className="p-4 gap-2 mt-4 flex justify-end items-center w-auto">
        <Button variant="ghost" onClick={handleBack}>
          Cancelar
        </Button>
        <Button onClick={() => handleUpdate(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Salvar alterações
        </Button>
      </Card>
    </div>
  );
}
