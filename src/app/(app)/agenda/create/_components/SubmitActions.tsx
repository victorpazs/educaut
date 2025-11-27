import { Button } from "@/components/ui/button";
import { ScheduleFormData, ScheduleCreateSchema } from "../_models";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { withValidation } from "@/lib/validation";
import { toast } from "@/lib/toast";
import { createScheduleAction } from "@/app/(app)/agenda/actions";

interface SubmitActionsProps {
  formData: ScheduleFormData;
  currentStep: string;
  handleBack: () => void;
}

export function SubmitActions({ formData, handleBack }: SubmitActionsProps) {
  const handleCreate = withValidation(ScheduleCreateSchema, async () => {
    const res = await createScheduleAction({
      title: formData.title,
      description: formData.description,
      start: formData.start,
      end: formData.end,
      studentIds: formData.studentIds,
      activityIds: formData.activityIds,
    });
    if (!res.success) {
      toast.error("Erro", res.message || "Não foi possível criar a aula.");
      return;
    }
    toast.success("Sucesso", "Aula criada com sucesso.");
    handleBack();
  });

  return (
    <div className="flex justify-end">
      <Card className="p-4 gap-2 mt-4 flex justify-end items-center w-auto">
        <Button variant="ghost" onClick={handleBack}>
          Cancelar
        </Button>
        <Button onClick={() => handleCreate(formData)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Criar aula
        </Button>
      </Card>
    </div>
  );
}
