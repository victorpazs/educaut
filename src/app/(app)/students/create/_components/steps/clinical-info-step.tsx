import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
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
            placeholder="Selecione o nível de suporte"
          >
            {teaOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
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
            placeholder="Selecione"
          >
            {communicationOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
