import {
  Calendar,
  Compass,
  FileCheck,
  Home,
  Settings,
  User,
} from "lucide-react";

export const navigationTabs = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/students", label: "Alunos", icon: User },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/activities", label: "Atividades", icon: FileCheck },
  { href: "/discover", label: "Modelos", icon: Compass },
  { href: "/settings", label: "Ajustes", icon: Settings },
];
