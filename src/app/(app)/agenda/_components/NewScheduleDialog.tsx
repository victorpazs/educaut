"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { StudentComboboxClient } from "@/components/students-combobox.client";
import {
  formatDate,
  formatDateTimeLocal,
  parseDateTimeLocal,
} from "@/lib/utils";
import { withValidation } from "@/lib/validation";
import { ScheduleCreateSchema, type ScheduleCreateValues } from "../_models";
import { ScheduleForm, type ScheduleFormState } from "./ScheduleForm";

type NewScheduleDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: ScheduleCreateValues) => void | Promise<void>;
  start: Date;
  end: Date;
};

export function NewScheduleDialog({
  open,
  onClose,
  onSave,
  start,
  end,
}: NewScheduleDialogProps) {
  const [scheduleData, setScheduleData] = useState<{
    title: string;
    description: string;
    startInput: string;
    endInput: string;
    studentId: number | null;
  }>({
    title: "",
    description: "",
    startInput: formatDateTimeLocal(start),
    endInput: formatDateTimeLocal(end),
    studentId: null,
  });
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});

  useEffect(() => {
    if (open) {
      setScheduleData({
        title: "",
        description: "",
        startInput: formatDateTimeLocal(start),
        endInput: formatDateTimeLocal(end),
        studentId: null,
      });
      setErrors({});
    }
  }, [open, start, end]);

  const canSave = useMemo(() => {
    if (!scheduleData.title.trim()) return false;
    if (!scheduleData.startInput || !scheduleData.endInput) return false;
    const s = parseDateTimeLocal(scheduleData.startInput);
    const e = parseDateTimeLocal(scheduleData.endInput);
    return s.getTime() < e.getTime();
  }, [scheduleData]);

  const handleSave = () => {
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
    const values: ScheduleCreateValues = {
      title: scheduleData.title.trim(),
      description: scheduleData.description.trim() || undefined,
      start: s,
      end: e,
      studentId: scheduleData.studentId ?? 0,
    };
    const submit = withValidation(ScheduleCreateSchema, async (data) => {
      await onSave(data);
    });
    submit(values);
  };

  const handleFormChange = (next: ScheduleFormState) => {
    setScheduleData((prev) => ({
      ...prev,
      ...next,
    }));
    setErrors((prev) => ({ ...prev, time: undefined }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Nova aula</DialogTitle>
        </DialogHeader>

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
          />
          <div>
            <Label>Estudante</Label>
            <StudentComboboxClient
              value={scheduleData.studentId}
              onChange={(v) =>
                setScheduleData((prev) => ({ ...prev, studentId: v }))
              }
              buttonClassName="w-full"
              className="w-full min-w-[320px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
