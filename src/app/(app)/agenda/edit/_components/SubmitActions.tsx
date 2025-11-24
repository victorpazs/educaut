import { Button } from "@/components/ui/button";
import {
  ScheduleFormData,
  ScheduleCreateSchema,
} from "@/app/(app)/agenda/create/_models";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { withValidation } from "@/lib/validation";
import { toast } from "@/lib/toast";
import { updateScheduleAction } from "@/app/(app)/agenda/actions";

interface SubmitActionsProps {
  scheduleId: number;
  formData: ScheduleFormData;
  currentStep: string;
  handleBack: () => void;
}

export function SubmitActions({
  scheduleId,
  formData,
  handleBack,
}: SubmitActionsProps) {
  const handleUpdate = withValidation(ScheduleCreateSchema, async () => {
    const res = await updateScheduleAction({
      id: scheduleId,
      title: formData.title,
      description: formData.description,
      start: formData.start,
      end: formData.end,
      studentId: formData.studentId!,
      activityIds: formData.activityIds,
    });
    if (!res.success) {
      toast.error("Erro", res.message || "Não foi possível atualizar a aula.");
      return;
    }
    toast.success("Sucesso", "Aula atualizada com sucesso.");
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
