import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentFormData } from "../../create/_models";
import { supportLevels } from "@/lib/tea_levels.utils";
import { SchoolYearSelect } from "@/components/school-year-select";
import { BirthdayPicker } from "@/components/birthday-picker";
import { Chip } from "@/components/ui/chip";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BasicInfoStepProps {
  formData: StudentFormData;
  onInputChange: <T>(
    field: keyof StudentFormData | (keyof StudentFormData)[],
    value: T | T[]
  ) => void;
  onCheckboxChange?: (field: keyof StudentFormData, value: boolean) => void;
  onDateChange?: (field: keyof StudentFormData, value: Date) => void;
}

export function BasicInfoStep({
  formData,
  onInputChange,
  onCheckboxChange,
  onDateChange,
}: BasicInfoStepProps) {
  const [responsibleInput, setResponsibleInput] = React.useState("");

  const handleAddResponsible = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const current = formData.responsible || [];
    if (!current.includes(trimmed)) {
      onInputChange<string[]>("responsible", [...current, trimmed]);
      setResponsibleInput("");
    }
  };

  const handleRemoveResponsible = (value: string) => {
    const current = formData.responsible || [];
    onInputChange<string[]>(
      "responsible",
      current.filter((item) => item !== value)
    );
  };

  const handleResponsibleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddResponsible(responsibleInput);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8">
          <label className="text-sm font-medium">Nome *</label>
          <Input
            value={formData.name}
            onChange={(e) => onInputChange<string>("name", e.target.value)}
            placeholder="Nome completo do aluno"
            required
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <BirthdayPicker
            value={formData.birthday as Date | undefined}
            onChange={(date) => onDateChange?.("birthday", date)}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="text-sm font-medium">Ano escolar *</label>
          <SchoolYearSelect
            value={formData.school_year?.toString() || ""}
            onYearAndSegmentChange={(year, segment) =>
              onInputChange(
                ["school_year", "school_segment"],
                [Number(year), segment]
              )
            }
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="text-sm font-medium">Nível de Suporte TEA *</label>
          <Select
            value={formData.tea_support_level?.toString() || ""}
            onValueChange={(value) =>
              onInputChange<number | null>(
                "tea_support_level",
                value ? Number(value) : null
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o nível de suporte" />
            </SelectTrigger>
            <SelectContent>
              {supportLevels.map((level) => (
                <SelectItem key={level.value} value={level.value.toString()}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(formData.tea_support_level ?? 0) > 0 && (
          <div className="col-span-12 md:col-span-4 flex items-end mb-2">
            <Checkbox
              id="non_verbal"
              checked={!!formData.non_verbal}
              onCheckedChange={(checked) =>
                onCheckboxChange?.("non_verbal", checked)
              }
              label="Não-Verbal"
            />
          </div>
        )}

        <div className="col-span-12">
          <label className="text-sm font-medium">Diagnóstico</label>
          <Textarea
            value={formData.diagnosis || ""}
            onChange={(e) => onInputChange("diagnosis", e.target.value)}
            placeholder="Descreva o diagnóstico do aluno"
            rows={4}
          />
        </div>

        <div className="col-span-12">
          <label className="text-sm font-medium">Responsáveis</label>
          <div className="relative">
            <div
              className={cn(
                "flex min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                "flex flex-wrap gap-2 items-center"
              )}
            >
              {(formData.responsible || []).map((item) => (
                <Chip
                  key={item}
                  label={item}
                  size="sm"
                  variant="standard"
                  color="default"
                  endIcon={
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveResponsible(item);
                      }}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  }
                />
              ))}
              <input
                type="text"
                value={responsibleInput}
                onChange={(e) => setResponsibleInput(e.target.value)}
                onKeyDown={handleResponsibleKeyDown}
                placeholder={
                  (formData.responsible || []).length === 0
                    ? "Digite e pressione Enter para adicionar..."
                    : ""
                }
                className="flex-1 min-w-[120px] outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="col-span-12">
          <label className="text-sm font-medium">Descrição</label>
          <Textarea
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Informações adicionais sobre o aluno"
          />
        </div>
      </div>
    </>
  );
}
