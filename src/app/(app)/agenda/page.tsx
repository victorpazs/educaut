"use client";

import { PageHeader } from "@/components/page-header";
import { SchoolAgenda } from "./_components/SchoolAgenda";
import { useAgenda } from "./_hooks/use-agenda";
import { useEffect } from "react";

export default function AgendaPage() {
  const { refetch } = useAgenda();

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex h-full flex-col gap-2">
      <PageHeader title="Agenda" subtitle="Organize as suas próximas aulas" />
      <SchoolAgenda />
    </div>
  );
}
