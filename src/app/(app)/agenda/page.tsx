"use client";

import { PageHeader } from "@/components/page-header";
import { SchoolAgenda } from "./_components/SchoolAgenda";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EditScheduleDialog } from "./_components/EditScheduleDialog";

export default function AgendaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editIdParam = searchParams.get("edit_id");
  const editId = useMemo(() => {
    const parsed = Number(editIdParam);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [editIdParam]);

  const handleCloseEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit_id");
    const query = params.toString();
    router.replace(query ? `?${query}` : ".");
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <PageHeader title="Agenda" subtitle="Organize as suas próximas aulas" />
      <SchoolAgenda />
      {editId && (
        <EditScheduleDialog
          open={Boolean(editId)}
          onClose={handleCloseEdit}
          scheduleId={editId}
        />
      )}
    </div>
  );
}
