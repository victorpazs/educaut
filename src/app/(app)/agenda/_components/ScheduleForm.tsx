"use client";

import { ReactNode, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { formatDateTimeLocal, parseDateTimeLocal } from "@/lib/utils";
import { getPresetRange } from "../utils";
import type { Presets } from "../utils";
import { Moon, Sun, Sunrise } from "lucide-react";

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
  isEditing = false,
}: {
  value: ScheduleFormState;
  onChange: (next: ScheduleFormState) => void;
  errors?: ScheduleFormErrors;
  disabled?: boolean;
  extraFields?: ReactNode;
  isEditing?: boolean;
}) {
  const [preset, setPreset] = useState<Presets | null>(null);

  const applyPreset = (type: Presets) => {
    const base = parseDateTimeLocal(value.startInput);
    const { start: s, end: e } = getPresetRange(type, base) ?? {
      start: base,
      end: base,
    };
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

      {!isEditing ? (
        <div className="mb-6">
          <Tabs
            className="w-full! min-w-full!"
            value={preset ?? "none"}
            onValueChange={(v) => {
              if (v === "none") {
                setPreset(null);
                return;
              }
              applyPreset(v as Presets);
            }}
          >
            <TabsList>
              <TabsTrigger value="morning">
                <Sunrise className="h-4 w-4" />
                Matutino
              </TabsTrigger>
              <TabsTrigger value="afternoon">
                <Sun className="h-4 w-4" />
                Vespertino
              </TabsTrigger>
              <TabsTrigger value="evening">
                <Moon className="h-4 w-4" />
                Noturno
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ) : null}
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
