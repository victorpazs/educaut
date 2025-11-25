"use client";

import { PageHeader } from "@/components/page-header";
import { SchoolAgenda } from "./_components/SchoolAgenda";

export default function AgendaPage() {
  return (
    <div className="flex h-full flex-col gap-2">
      <PageHeader title="Agenda" subtitle="Organize as suas próximas aulas" />
      <SchoolAgenda />
    </div>
  );
}
