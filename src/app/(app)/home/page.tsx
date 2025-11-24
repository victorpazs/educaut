"use client";

import { PageHeader } from "@/components/page-header";

import { QuickAccess } from "./_components/QuickAccess";
import { HomeTotalizers } from "./_components/HomeTotalizers";
import { HomeAgenda } from "./_components/HomeAgenda";
import { CurrentClass } from "./_components/CurrentClass";

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
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="grid grid-cols-12 gap-4">
            <HomeTotalizers />
            <div className="col-span-12 md:hidden flex flex-col gap-3">
              <CurrentClass />
              <QuickAccess />
            </div>

            <HomeAgenda />
          </div>
        </div>

        <div className="hidden md:flex col-span-12 md:col-span-4 lg:col-span-3 flex-col gap-3">
          <CurrentClass />
          <QuickAccess />
        </div>
      </div>
    </div>
  );
}
