import {
  AlertTriangle,
  BicepsFlexed,
  Brain,
  Heart,
  HeartPulse,
  Target,
  User,
} from "lucide-react";

export function getAttributeIcon(attribute: string) {
  const attributeMap = {
    difficulty: AlertTriangle,
    disorder: Brain,
    hyperfocus: Target,
    potential: BicepsFlexed,
    comorbidities: HeartPulse,
    "basic-info": User,
  };
  return attributeMap[attribute as keyof typeof attributeMap];
}

export function getAttributeLabel(attribute: string) {
  const attributeMap = {
    difficulty: "Dificuldades",
    disorder: "Distúrbios Clínicos",
    hyperfocus: "Hiperfoco",
    potential: "Potencialidades",
    comorbidities: "Comorbidades",
    "basic-info": "Informações básicas",
  };

  return attributeMap[attribute as keyof typeof attributeMap] || attribute;
}

export function getAttributeSubtitle(attribute: string) {
  const attributeMap = {
    difficulty: "Selecione as dificuldades do aluno",
    disorder: "Selecione os distúrbios clínicos do aluno",
    hyperfocus: "Selecione o hiperfoco do aluno",
    potential: "Selecione as potencialidades do aluno",
    comorbidities: "Selecione as comorbidades do aluno",
    "basic-info": "Dados de registro do aluno",
  };
  return attributeMap[attribute as keyof typeof attributeMap] || attribute;
}
