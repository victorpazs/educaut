"use client";

import { ReactNode, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateTimeLocal, parseDateTimeLocal } from "@/lib/utils";
import { getAfternoonRange, getAllDayRange, getMorningRange } from "../utils";

export type ScheduleFormState = {
  title: string;
  description: string;
  startInput: string; // datetime-local string
  endInput: string; // datetime-local string
};

export type ScheduleFormErrors = {
  title?: string;
  time?: string;
};

export function ScheduleForm({
  value,
  onChange,
  errors,
  disabled,
  extraFields,
}: {
  value: ScheduleFormState;
  onChange: (next: ScheduleFormState) => void;
  errors?: ScheduleFormErrors;
  disabled?: boolean;
  extraFields?: ReactNode;
}) {
  const [preset, setPreset] = useState<"all" | "morning" | "afternoon" | null>(
    null
  );

  const applyPreset = (type: "all" | "morning" | "afternoon") => {
    const base = parseDateTimeLocal(value.startInput);
    const { start: s, end: e } =
      type === "all"
        ? getAllDayRange(base)
        : type === "morning"
        ? getMorningRange(base)
        : getAfternoonRange(base);
    onChange({
      ...value,
      startInput: formatDateTimeLocal(s),
      endInput: formatDateTimeLocal(e),
    });
    setPreset(type);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={value.title}
          onChange={(e) =>
            onChange({
              ...value,
              title: e.target.value,
            })
          }
          placeholder="Ex.: Aula de Matemática"
          aria-invalid={Boolean(errors?.title)}
          disabled={disabled}
        />
        {errors?.title && (
          <p className="text-sm text-destructive mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={value.description}
          onChange={(e) =>
            onChange({
              ...value,
              description: e.target.value,
            })
          }
          placeholder="Detalhes da aula (opcional)"
          disabled={disabled}
        />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 ">
          <Label htmlFor="start">Data de início</Label>
          <Input
            id="start"
            type="datetime-local"
            value={value.startInput}
            onChange={(e) =>
              onChange({
                ...value,
                startInput: e.target.value,
              })
            }
            aria-invalid={Boolean(errors?.time)}
            disabled={disabled}
          />
        </div>
        <div className="col-span-12 ">
          <Label htmlFor="end">Data de fim</Label>
          <Input
            id="end"
            type="datetime-local"
            value={value.endInput}
            onChange={(e) =>
              onChange({
                ...value,
                endInput: e.target.value,
              })
            }
            aria-invalid={Boolean(errors?.time)}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="flex items-start mb-6 gap-4">
        <Checkbox
          id="preset_all"
          checked={preset === "all"}
          onCheckedChange={(v) => v && applyPreset("all")}
          label="Dia inteiro"
        />
        <Checkbox
          id="preset_morning"
          checked={preset === "morning"}
          onCheckedChange={(v) => v && applyPreset("morning")}
          label="Período da manhã"
        />
        <Checkbox
          id="preset_afternoon"
          checked={preset === "afternoon"}
          onCheckedChange={(v) => v && applyPreset("afternoon")}
          label="Período da tarde"
        />
      </div>
      {errors?.time && (
        <p className="text-sm text-destructive">{errors.time}</p>
      )}

      {extraFields}
    </div>
  );
}
