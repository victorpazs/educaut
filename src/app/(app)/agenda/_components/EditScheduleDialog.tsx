"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  formatDateTimeLocal,
  parseDateTimeLocal,
} from "@/lib/utils";
import { useEditSchedule } from "../_hooks/use-edit-schedule";
import { updateScheduleAction } from "../actions";
import { toast } from "@/lib/toast";
import { useAgenda } from "../_hooks/use-agenda";
import { ScheduleForm, type ScheduleFormState } from "./ScheduleForm";
import { User, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { deleteScheduleAction } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Avatar } from "@/components/ui/avatar";
import { ScheduleFormSkeleton } from "./ScheduleFormSkeleton";

type EditScheduleDialogProps = {
  refetch: () => void;
  open: boolean;
  onClose: () => void;
  scheduleId: number;
};

export function EditScheduleDialog({
  refetch,
  open,
  onClose,
  scheduleId,
}: EditScheduleDialogProps) {
  const { scheduleData, setScheduleData, loading, loadError } = useEditSchedule(
    {
      open,
      scheduleId,
    }
  );
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});
  const [saving, setSaving] = useState<boolean>(false);
  const handleFormChange = (next: ScheduleFormState) => {
    setScheduleData((prev) => ({
      ...prev,
      ...next,
    }));
    setErrors((prev) => ({ ...prev, time: undefined }));
  };
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  useEffect(() => {
    if (loadError) {
      setErrors({ title: loadError });
    } else {
      setErrors((prev) => ({ time: prev.time }));
    }
  }, [loadError]);

  const canSave = useMemo(() => {
    if (!scheduleData.title.trim()) return false;
    if (!scheduleData.startInput || !scheduleData.endInput) return false;
    const s = parseDateTimeLocal(scheduleData.startInput);
    const e = parseDateTimeLocal(scheduleData.endInput);
    return s.getTime() < e.getTime();
  }, [scheduleData]);

  const handleSave = async () => {
    const newErrors: typeof errors = {};
    if (!scheduleData.title.trim()) {
      newErrors.title = "Informe o título";
    }
    const s = parseDateTimeLocal(scheduleData.startInput);
    const e = parseDateTimeLocal(scheduleData.endInput);
    if (!(s.getTime() < e.getTime())) {
      newErrors.time = `A data de início (${formatDate(
        s
      )}) deve ser antes da data de fim (${formatDate(e)})`;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (!scheduleId) return;
    setSaving(true);
    try {
      const result = await updateScheduleAction({
        id: scheduleId,
        title: scheduleData.title.trim(),
        description: scheduleData.description.trim() || undefined,
        start: s,
        end: e,
      });
      if (!result.success) {
        toast.error(result.message || "Não foi possível atualizar a aula.");
        return;
      }
      toast.success("Aula atualizada com sucesso.");
      refetch();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent onClose={onClose}>
          <DialogHeader>
            <DialogTitle>Editar aula</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="px-6 space-y-4">
              <ScheduleFormSkeleton />
            </div>
          ) : (
            <div className="px-6 space-y-4">
              <ScheduleForm
                value={{
                  title: scheduleData.title,
                  description: scheduleData.description,
                  startInput: scheduleData.startInput,
                  endInput: scheduleData.endInput,
                }}
                onChange={handleFormChange}
                errors={errors}
                disabled={loading}
              />
              {scheduleData && scheduleData.student ? (
                <Card>
                  <CardContent className="p-4!">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Avatar>
                        <User className="h-4 w-4" />
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {scheduleData.student.name}
                        </span>
                        <span className="text-xs text-secondary">
                          Aluno(a) selecionado
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
              <Accordion title="Avançado" defaultExpanded={false} size="sm">
                <div className="flex">
                  <Button
                    className="w-full rounded-xl"
                    size="sm"
                    variant="destructive"
                    onClick={() => setOpenDelete(true)}
                    disabled={loading || saving}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir aula
                  </Button>
                </div>
              </Accordion>
            </div>
          )}

          <DialogFooter>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!canSave || loading || saving}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Remover aula"
        description="Tem certeza que deseja remover esta aula? Esta ação não poderá ser desfeita."
        labelAccept="Remover"
        labelDeny="Cancelar"
        onAccept={async () => {
          const res = await deleteScheduleAction(scheduleId);
          if (!res.success) {
            toast.error(res.message || "Não foi possível remover a aula.");
            return;
          }
          toast.success("Aula removida com sucesso.");
          setOpenDelete(false);
          refetch();
          onClose();
        }}
      />
    </>
  );
}
