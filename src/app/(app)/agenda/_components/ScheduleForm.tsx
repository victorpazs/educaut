"use client";

import { ReactNode, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateTimePicker } from "@/components/ui/date-time-picker";
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

      <div className="flex items-start mb-6 gap-4">
        <Tabs
          className="w-full"
          value={preset ?? "none"}
          onValueChange={(v) => {
            if (v === "none") {
              setPreset(null);
              return;
            }
            applyPreset(v as "all" | "morning" | "afternoon");
          }}
        >
          <TabsList>
            <TabsTrigger value="all">Dia inteiro</TabsTrigger>
            <TabsTrigger value="morning">Período da manhã</TabsTrigger>
            <TabsTrigger value="afternoon">Período da tarde</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <DateTimePicker
            id="start"
            label="Data de início"
            value={value.startInput}
            onChange={(newVal) => {
              onChange({
                ...value,
                startInput: newVal,
              });
              setPreset(null);
            }}
          />
        </div>
        <div className="col-span-12">
          <DateTimePicker
            id="end"
            label="Data de fim"
            value={value.endInput}
            onChange={(newVal) => {
              onChange({
                ...value,
                endInput: newVal,
              });

              setPreset(null);
            }}
          />
        </div>
      </div>

      {errors?.time && (
        <p className="text-sm text-destructive">{errors.time}</p>
      )}

      {extraFields}
    </div>
  );
}
