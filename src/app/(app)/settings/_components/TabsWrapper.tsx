"use client";

import { TabsSidebar } from "@/components/tabs-sidebar";
import { School, User } from "lucide-react";

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
  ];
  return <TabsSidebar options={options} />;
}
