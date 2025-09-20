"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";

interface StudentFormData {
  name: string;
  segment: string;
  age: string;
  tea: string;
  otherDisorders: string[];
  hyperfocus: string[];
  communication: string;
  preferences: string[];
  difficulties: string[];
  observation: string;
}

const segmentOptions = [
  "Educação Infantil",
  "Ensino Fundamental 2º ao 5º ano",
  "Ensino Fundamental 6º ao 9º ano",
  "Ensino Médio"
];

const teaOptions = [
  "TEA - nível de suporte 1",
  "TEA - nível de suporte 2"
];

const otherDisorderOptions = [
  "Ansiedade",
  "Coordenação Motora",
  "Deficiência Intelectual",
  "Rigidez Cognitiva"
];

const hyperfocusOptions = [
  "letras e números",
  "leitura fluente",
  "lógica",
  "cálculos",
  "análise lógica",
  "criatividade",
  "tecnologia",
  "programações"
];

const communicationOptions = [
  "sim",
  "não"
];

const preferenceOptions = [
  "jogos de encaixe",
  "quebra-cabeça",
  "jogos que envolvem raciocínio lógico e categorização",
  "realizar pesquisas",
  "regras de jogos",
  "planejamento e resolução de problemas",
  "jogos educativos",
  "percepção visual"
];

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
  "questões comportamentais"
];

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [formData, setFormData] = React.useState<StudentFormData>({
    name: "",
    segment: "",
    age: "",
    tea: "",
    otherDisorders: [],
    hyperfocus: [],
    communication: "",
    preferences: [],
    difficulties: [],
    observation: ""
  });

  const [isLoading, setIsLoading] = React.useState(false);

  // Mock data loading - in real app this would fetch from API
  React.useEffect(() => {
    // Simulate loading student data
    if (studentId) {
      setFormData({
        name: "Ana Silva",
        segment: "Ensino Fundamental 2º ao 5º ano",
        age: "8",
        tea: "TEA - nível de suporte 1",
        otherDisorders: ["Ansiedade"],
        hyperfocus: ["leitura fluente", "lógica"],
        communication: "sim",
        preferences: ["jogos educativos", "quebra-cabeça"],
        difficulties: ["interação social", "manter diálogo"],
        observation: "Aluna demonstra grande interesse por livros e atividades que envolvem raciocínio lógico."
      });
    }
  }, [studentId]);

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof StudentFormData, option: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = checked 
        ? [...currentArray, option]
        : currentArray.filter(item => item !== option);
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Saving student data:", formData);
      router.push("/students");
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/students");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Editar Aluno"
          subtitle="Atualize as informações do aluno."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Aluno</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nome do aluno"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Idade</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Idade"
                  min="1"
                  max="20"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Segmento Escolar</label>
              <Select
                value={formData.segment}
                onValueChange={(value) => handleInputChange("segment", value)}
                placeholder="Selecione o segmento"
              >
                {segmentOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Clínicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">TEA</label>
              <Select
                value={formData.tea}
                onValueChange={(value) => handleInputChange("tea", value)}
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
                    onCheckedChange={(checked) => handleCheckboxChange("otherDisorders", option, checked)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Comunicação</label>
              <Select
                value={formData.communication}
                onValueChange={(value) => handleInputChange("communication", value)}
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

        <Card>
          <CardHeader>
            <CardTitle>Características e Habilidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hiperfoco</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {hyperfocusOptions.map((option) => (
                  <Checkbox
                    key={option}
                    id={`hyperfocus-${option}`}
                    label={option}
                    checked={formData.hyperfocus.includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange("hyperfocus", option, checked)}
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
                    onCheckedChange={(checked) => handleCheckboxChange("preferences", option, checked)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dificuldades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dificuldades identificadas</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {difficultyOptions.map((option) => (
                  <Checkbox
                    key={option}
                    id={`difficulty-${option}`}
                    label={option}
                    checked={formData.difficulties.includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange("difficulties", option, checked)}
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
                onChange={(e) => handleInputChange("observation", e.target.value)}
                placeholder="Digite observações adicionais sobre o aluno..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sticky bottom buttons */}
        <div className="fixed bottom-[15px] right-2 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <Card className="backdrop-blur-sm bg-white/15">
              <CardContent className="p-4 flex justify-center items-center">
                <div className="flex justify-center items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      "Salvando..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="h-20"></div>
      </form>
    </div>
  );
}