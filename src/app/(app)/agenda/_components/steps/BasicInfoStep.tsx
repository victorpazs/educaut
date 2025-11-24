"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StudentComboboxClient } from "@/components/students-combobox.client";
import { ScheduleFormData } from "../../create/_models";

interface BasicInfoStepProps {
  formData: ScheduleFormData;
  onInputChange: <T>(
    field: keyof ScheduleFormData | (keyof ScheduleFormData)[],
    value: T | T[]
  ) => void;
}

export function BasicInfoStep({ formData, onInputChange }: BasicInfoStepProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange<string>("title", e.target.value)}
          placeholder="Ex.: Aula de Matemática sobre frações."
          required
        />
      </div>

      <div className="col-span-12">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Descreva o que será abordado nesta aula."
          rows={4}
        />
      </div>

      <div className="col-span-12">
        <Label>Aluno *</Label>
        <StudentComboboxClient
          value={formData.studentId}
          onChange={(v) => onInputChange<number | null>("studentId", v)}
          buttonClassName="w-full"
          className="w-full min-w-[320px]"
        />
      </div>
    </div>
  );
}
