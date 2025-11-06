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
import { StudentFormData } from "../../_models";
import { supportLevels } from "@/lib/tea_levels.utils";
import { SchoolYearSelect } from "@/components/school-year-select";
import { BirthdayPicker } from "@/components/birthday-picker";

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
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8">
          <label className="text-sm font-medium">Aluno *</label>
          <Input
            value={formData.name}
            onChange={(e) => onInputChange<string>("name", e.target.value)}
            placeholder="Nome do aluno"
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
          <label className="text-sm font-medium">Descrição</label>
          <Textarea
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Informações adicionais sobre o aluno"
            rows={4}
          />
        </div>
      </div>
    </>
  );
}
