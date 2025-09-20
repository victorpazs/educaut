import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentFormData } from "../../_types";

interface CharacteristicsStepProps {
  formData: StudentFormData;
  onCheckboxChange: (
    field: keyof StudentFormData,
    option: string,
    checked: boolean
  ) => void;
}

const hyperfocusOptions = [
  "letras e números",
  "leitura fluente",
  "lógica",
  "cálculos",
  "análise lógica",
  "criatividade",
  "tecnologia",
  "programações",
];

const preferenceOptions = [
  "jogos de encaixe",
  "quebra-cabeça",
  "jogos que envolvem raciocínio lógico e categorização",
  "realizar pesquisas",
  "regras de jogos",
  "planejamento e resolução de problemas",
  "jogos educativos",
  "percepção visual",
];

export function CharacteristicsStep({
  formData,
  onCheckboxChange,
}: CharacteristicsStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Características e Habilidades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Hiperfoco</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {hyperfocusOptions.map((option) => (
              <Checkbox
                key={option}
                id={`hyperfocus-${option}`}
                label={option}
                checked={formData.hyperfocus.includes(option)}
                onCheckedChange={(checked) =>
                  onCheckboxChange("hyperfocus", option, checked)
                }
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preferências</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {preferenceOptions.map((option) => (
              <Checkbox
                key={option}
                id={`preference-${option}`}
                label={option}
                checked={formData.preferences.includes(option)}
                onCheckedChange={(checked) =>
                  onCheckboxChange("preferences", option, checked)
                }
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
