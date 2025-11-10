"use client";

import { PageHeader } from "@/components/page-header";
import { TabsWrapper } from "./_components/TabsWrapper";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pathname.split("/").pop();

  const getSubtitle = () => {
    switch (title) {
      case "profile":
        return "Gerencie os seus dados pessoais na plataforma.";
      case "schools":
        return "Gerencie as suas escolas cadastradas na plataforma.";
      case "attributes":
        return "Gerencie os atributos da escola atual.";
      default:
        return "Gerencie as suas configurações na plataforma.";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader title="Configurações" subtitle={getSubtitle()} />
        </div>
        <div className="col-span-12 md:col-span-4  lg:col-span-3">
          <TabsWrapper />
        </div>
        <div className="col-span-12 lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
