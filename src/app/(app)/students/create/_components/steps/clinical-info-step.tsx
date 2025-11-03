import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentFormData } from "../../_types";

interface ClinicalInfoStepProps {
  formData: StudentFormData;
  onInputChange: (field: keyof StudentFormData, value: string) => void;
  onCheckboxChange: (
    field: keyof StudentFormData,
    option: string,
    checked: boolean
  ) => void;
}

const teaOptions = ["TEA - nível de suporte 1", "TEA - nível de suporte 2"];

const otherDisorderOptions = [
  "Ansiedade",
  "Coordenação Motora",
  "Deficiência Intelectual",
  "Rigidez Cognitiva",
];

const communicationOptions = ["sim", "não"];

export function ClinicalInfoStep({
  formData,
  onInputChange,
  onCheckboxChange,
}: ClinicalInfoStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Clínicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">TEA *</label>
          <Select
            value={formData.tea}
            onValueChange={(value) => onInputChange("tea", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o nível de suporte" />
            </SelectTrigger>
            <SelectContent>
              {teaOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Outro transtorno junto</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {otherDisorderOptions.map((option) => (
              <Checkbox
                key={option}
                id={`disorder-${option}`}
                label={option}
                checked={formData.otherDisorders.includes(option)}
                onCheckedChange={(checked) =>
                  onCheckboxChange("otherDisorders", option, checked)
                }
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Comunicação *</label>
          <Select
            value={formData.communication}
            onValueChange={(value) => onInputChange("communication", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {communicationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
