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
import { formatDate } from "@/lib/utils";
import { getScheduleById } from "../actions";

type EditScheduleDialogProps = {
  open: boolean;
  onClose: () => void;
  scheduleId: number;
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
  const [datePart, timePart] = value.split("T");
  const [y, m, d] = datePart.split("-").map((v) => Number(v));
  const [hh, mm] = timePart.split(":").map((v) => Number(v));
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function EditScheduleDialog({
  open,
  onClose,
  scheduleId,
}: EditScheduleDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [scheduleData, setScheduleData] = useState<{
    title: string;
    description: string;
    startInput: string;
    endInput: string;
  }>({
    title: "",
    description: "",
    startInput: formatDateTimeLocal(new Date()),
    endInput: formatDateTimeLocal(new Date()),
  });
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});

  useEffect(() => {
    let active = true;
    if (!open || !scheduleId) return;
    const load = async () => {
      setLoading(true);
      setErrors({});
      try {
        const result = await getScheduleById(scheduleId);
        if (!active) return;
        if (result.success && result.data) {
          const start =
            result.data.start_time instanceof Date
              ? result.data.start_time
              : new Date(result.data.start_time);
          const end =
            result.data.end_time instanceof Date
              ? result.data.end_time
              : new Date(result.data.end_time);
          setScheduleData({
            title: result.data.title ?? "",
            description: result.data.description ?? "",
            startInput: formatDateTimeLocal(start),
            endInput: formatDateTimeLocal(end),
          });
        } else {
          setErrors({
            title: result.message || "Falha ao carregar agendamento",
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [open, scheduleId]);

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
    // No escopo atual, apenas carregamos e exibimos os dados.
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Editar aula</DialogTitle>
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            size="sm"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Fechar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!canSave || loading}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
