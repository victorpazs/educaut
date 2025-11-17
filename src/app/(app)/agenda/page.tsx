"use client";

import { PageHeader } from "@/components/page-header";
import { SchoolAgenda } from "./_components/SchoolAgenda";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EditScheduleDialog } from "./_components/EditScheduleDialog";
import { useAgenda } from "./_hooks/use-agenda";

export default function AgendaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const editIdParam = searchParams.get("scheduleId");
  const { refetch } = useAgenda();
  const editId = useMemo(() => {
    const parsed = Number(editIdParam);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [editIdParam]);

  const handleCloseEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("scheduleId");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <PageHeader title="Agenda" subtitle="Organize as suas próximas aulas" />
      <SchoolAgenda />
      {editId && (
        <EditScheduleDialog
          refetch={refetch}
          open={Boolean(editId)}
          onClose={() => handleCloseEdit()}
          scheduleId={editId}
        />
      )}
    </div>
  );
}
