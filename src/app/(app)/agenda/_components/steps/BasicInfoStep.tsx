"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { useSchoolStudents } from "@/hooks/useSchoolStudents";
import { ScheduleFormData } from "../../create/_models";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BasicInfoStepProps {
  formData: ScheduleFormData;
  onInputChange: <T>(
    field: keyof ScheduleFormData | (keyof ScheduleFormData)[],
    value: T | T[]
  ) => void;
}

export function BasicInfoStep({ formData, onInputChange }: BasicInfoStepProps) {
  const { studentsOptions: options } = useSchoolStudents();

  const handleAdd = (option: { value: number; label: string }) => {
    const currentIds = formData.studentIds || [];
    if (!currentIds.includes(option.value)) {
      onInputChange<number[]>("studentIds", [...currentIds, option.value]);
    }
  };

  const handleRemove = (option: { value: number; label: string }) => {
    const currentIds = formData.studentIds || [];
    onInputChange<number[]>(
      "studentIds",
      currentIds.filter((id) => id !== option.value)
    );
  };

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
        <Label>Alunos *</Label>
        <Combobox
          options={options}
          mode="additive"
          onAdd={handleAdd}
          onRemove={handleRemove}
          selectedValues={formData.studentIds || []}
          placeholder="Selecione um ou mais alunos..."
          buttonClassName="w-full font-normal! justify-between!"
          className="w-full! min-w-[320px]"
        />
        {formData.studentIds && formData.studentIds.length > 0 && (
          <>
            <span className="text-sm text-muted-foreground mt-4 block">
              {formData.studentIds.length}{" "}
              {formData.studentIds.length === 1
                ? "aluno selecionado"
                : "alunos selecionados"}
            </span>
            <ul className="flex flex-wrap items-start flex-col gap-2 mt-2">
              {formData.studentIds.map((id) => {
                const student = options.find((s) => s.value === id);
                if (!student) return null;

                return (
                  <li
                    key={id}
                    className="flex items-center justify-between min-w-48 gap-2"
                  >
                    <span className="text-sm">{student.label}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <X
                          className="text-secondary cursor-pointer size-3 ml-auto"
                          onClick={() => handleRemove(student)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Remover aluno</TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
