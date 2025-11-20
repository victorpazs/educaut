"use client";

import { TabsSidebar } from "@/components/tabs-sidebar";
import { School, Tags, User } from "lucide-react";

export function TabsWrapper() {
  const options = [
    {
      label: "Meu perfil",
      href: "/settings/profile",
      icon: User,
    },
    {
      label: "Escolas",
      href: "/settings/schools",
      icon: School,
    },
    {
      label: "Atributos de alunos",
      href: "/settings/attributes",
      icon: Tags,
    },
  ];
  return <TabsSidebar options={options} />;
}
