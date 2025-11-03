"use client";

import { PageHeader } from "@/components/page-header";

import { QuickAccess } from "./_components/QuickAccess";
import { HomeTotalizers } from "./_components/HomeTotalizers";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Bem vindo, educador!"
            subtitle="Gerencie suas aulas, atividades e agenda de forma simples e prática."
          />
        </div>

        <HomeTotalizers />

        <QuickAccess />
      </div>
    </div>
  );
}
