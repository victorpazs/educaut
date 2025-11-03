import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentFormData } from "../../_types";

interface BasicInfoStepProps {
  formData: StudentFormData;
  onInputChange: (field: keyof StudentFormData, value: string) => void;
}

const segmentOptions = [
  "Educação Infantil",
  "Ensino Fundamental 2º ao 5º ano",
  "Ensino Fundamental 6º ao 9º ano",
  "Ensino Médio",
];

export function BasicInfoStep({ formData, onInputChange }: BasicInfoStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Aluno *</label>
            <Input
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="Nome do aluno"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Idade *</label>
            <Input
              type="number"
              value={formData.age}
              onChange={(e) => onInputChange("age", e.target.value)}
              placeholder="Idade"
              min="1"
              max="20"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Segmento Escolar *</label>
          <Select
            value={formData.segment}
            onValueChange={(value) => onInputChange("segment", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o segmento" />
            </SelectTrigger>
            <SelectContent>
              {segmentOptions.map((option) => (
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
