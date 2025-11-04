import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { StudentFormData } from "../../_models";

interface DifficultiesStepProps {
  formData: StudentFormData;
  onInputChange: (field: keyof StudentFormData, value: string) => void;
  onCheckboxChange: (
    field: keyof StudentFormData,
    option: string,
    checked: boolean
  ) => void;
}

const difficultyOptions = [
  "escrita legível",
  "interação social",
  "manter diálogo",
  "leitura e escrita",
  "não aceita propostas pedagógicas",
  "iniciativa",
  "organização",
  "manutenção da rotina escolar",
  "cuidado com corpo e higiene",
  "atenção limitada",
  "iniciar e concluir tarefas",
  "desorganização no manuseio de materiais",
  "resistência a atividades de escrita e produção escolar",
  "fuga em tarefas complexas",
  "abstrair conceitos",
  "pensamento literal",
  "questões comportamentais",
];

export function DifficultiesStep({
  formData,
  onInputChange,
  onCheckboxChange,
}: DifficultiesStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dificuldades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Dificuldades identificadas
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {difficultyOptions.map((option) => (
                <Checkbox
                  key={option}
                  id={`difficulty-${option}`}
                  label={option}
                  checked={formData.difficulties.includes(option)}
                  onCheckedChange={(checked) =>
                    onCheckboxChange("difficulties", option, checked)
                  }
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium">Observação</label>
            <Textarea
              value={formData.observation}
              onChange={(e) => onInputChange("observation", e.target.value)}
              placeholder="Digite observações adicionais sobre o aluno..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
