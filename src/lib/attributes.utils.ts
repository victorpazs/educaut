import {
  AlertTriangle,
  BicepsFlexed,
  Brain,
  Heart,
  Target,
  User,
} from "lucide-react";

export function getAttributeIcon(attribute: string) {
  const attributeMap = {
    difficulty: AlertTriangle,
    disorder: Brain,
    hyperfocus: Target,
    potential: BicepsFlexed,
    preference: Heart,
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
    preference: "Preferências",
    "basic-info": "Informações Básicas",
  };

  return attributeMap[attribute as keyof typeof attributeMap] || attribute;
}
