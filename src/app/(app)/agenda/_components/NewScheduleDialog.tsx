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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { formatDate } from "@/lib/utils";

type NewScheduleDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    start: Date;
    end: Date;
    title: string;
    description?: string;
    studentId: number | null;
  }) => void;
  start: Date;
  end: Date;
  studentOptions?: ComboboxOption[];
};

function formatDateTimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseDateTimeLocal(value: string): Date {
  // value is in local time "YYYY-MM-DDTHH:mm"
  const [datePart, timePart] = value.split("T");
  const [y, m, d] = datePart.split("-").map((v) => Number(v));
  const [hh, mm] = timePart.split(":").map((v) => Number(v));
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function NewScheduleDialog({
  open,
  onClose,
  onSave,
  start,
  end,
  studentOptions = [],
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
    onSave({
      start: s,
      end: e,
      title: scheduleData.title.trim(),
      description: scheduleData.description.trim() || undefined,
      studentId: scheduleData.studentId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Nova aula</DialogTitle>
        </DialogHeader>

        <div className="px-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Data de início</Label>
              <Input
                id="start"
                type="datetime-local"
                value={scheduleData.startInput}
                onChange={(e) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    startInput: e.target.value,
                  }))
                }
                aria-invalid={Boolean(errors.time)}
              />
            </div>
            <div>
              <Label htmlFor="end">Data de fim</Label>
              <Input
                id="end"
                type="datetime-local"
                value={scheduleData.endInput}
                onChange={(e) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    endInput: e.target.value,
                  }))
                }
                aria-invalid={Boolean(errors.time)}
              />
            </div>
          </div>
          {errors.time && (
            <p className="text-sm text-destructive">{errors.time}</p>
          )}

          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={scheduleData.title}
              onChange={(e) =>
                setScheduleData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ex.: Aula de Matemática"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={scheduleData.description}
              onChange={(e) =>
                setScheduleData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detalhes da aula (opcional)"
            />
          </div>

          <div>
            <Label>Estudante</Label>
            <Combobox
              options={studentOptions}
              value={scheduleData.studentId}
              onChange={(v) =>
                setScheduleData((prev) => ({ ...prev, studentId: v }))
              }
              placeholder="Selecione o estudante..."
              searchPlaceholder="Buscar estudante..."
              emptyText="Nenhum estudante encontrado"
              buttonClassName="w-full"
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
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
