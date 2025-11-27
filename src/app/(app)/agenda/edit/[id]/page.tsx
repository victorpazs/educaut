"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, FileText, Settings, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  ScheduleCreateSteps,
  ScheduleFormData,
} from "@/app/(app)/agenda/create/_models";
import { TabsSidebar } from "@/components/tabs-sidebar";
import { ScheduleTabContent } from "@/app/(app)/agenda/_components/ScheduleTabContent";
import { SubmitActions } from "@/app/(app)/agenda/edit/_components/SubmitActions";
import {
  getScheduleById,
  getScheduleActivities,
  deleteScheduleAction,
} from "@/app/(app)/agenda/actions";
import { useAgenda } from "../../_hooks/use-agenda";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

export default function EditSchedulePage() {
  const { refetch } = useAgenda();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<ScheduleCreateSteps>(
    ScheduleCreateSteps.BASIC_INFO
  );
  const [formData, setFormData] = React.useState<ScheduleFormData>({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    studentIds: [],
    activityIds: [],
  });
  const [scheduleId, setScheduleId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] =
    React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  const handleBack = React.useCallback(() => {
    router.push("/agenda");
  }, [router, refetch]);

  React.useEffect(() => {
    const load = async () => {
      const idParam = params?.id;
      const idNum = Number(idParam);
      if (!idParam || isNaN(idNum)) {
        handleBack();
        return;
      }
      const res = await getScheduleById(idNum);
      if (!res.success || !res.data || res.data.status !== 1) {
        handleBack();
        return;
      }
      const s = res.data;
      setScheduleId(s.id);

      const activitiesRes = await getScheduleActivities(s.id);
      const activityIds =
        activitiesRes.success && activitiesRes.data ? activitiesRes.data : [];

      const studentIds =
        s.schedules_students?.map((ss) => ss.students.id) ?? [];

      setFormData({
        title: s.title ?? "",
        description: s.description ?? "",
        start:
          s.start_time instanceof Date ? s.start_time : new Date(s.start_time),
        end: s.end_time instanceof Date ? s.end_time : new Date(s.end_time),
        studentIds,
        activityIds,
      });
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const options = React.useMemo(
    () => [
      {
        label: "Informações da aula",
        identifier: ScheduleCreateSteps.BASIC_INFO,
        icon: Settings,
      },
      {
        label: "Horário",
        identifier: ScheduleCreateSteps.TIME_INFO,
        icon: Calendar,
      },
      {
        label: "Atividades",
        identifier: ScheduleCreateSteps.ACTIVITIES,
        icon: FileText,
      },
    ],
    []
  );

  const handleTabClick = React.useCallback((identifier: string) => {
    setActiveTab(identifier as ScheduleCreateSteps);
  }, []);

  const handleDelete = React.useCallback(async () => {
    if (!scheduleId) return;

    setIsDeleting(true);
    try {
      const res = await deleteScheduleAction(scheduleId);
      if (!res.success) {
        toast.error("Erro", res.message || "Não foi possível remover a aula.");
        return;
      }
      toast.success("Sucesso", "Aula removida com sucesso.");
      refetch();
      handleBack();
    } catch (error) {
      toast.error("Erro", "Não foi possível remover a aula.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  }, [scheduleId, refetch, handleBack]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="flex items-start justify-between gap-4">
            <PageHeader
              title="Editar aula"
              subtitle={`Atualize os dados da aula ${formData.title || ""}`}
              goBack={handleBack}
            />
            {!loading && scheduleId !== null && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Remover aula
              </Button>
            )}
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <TabsSidebar
            currentTab={activeTab}
            options={options?.map((opt) => ({
              ...opt,
              onClick: handleTabClick,
            }))}
          />
        </div>
        <div className="col-span-12 lg:col-span-9">
          {!loading && (
            <ScheduleTabContent
              activeTab={activeTab}
              formData={formData}
              setFormData={setFormData}
              scheduleId={scheduleId}
            />
          )}

          {!loading && scheduleId !== null && (
            <SubmitActions
              scheduleId={scheduleId}
              formData={formData}
              currentStep={activeTab}
              handleBack={handleBack}
            />
          )}
        </div>
      </div>
      <ConfirmationDialog
        title="Remover aula"
        description="Tem certeza que deseja remover esta aula? Essa ação não pode ser desfeita."
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onAccept={handleDelete}
        labelAccept={isDeleting ? "Removendo..." : "Remover"}
        labelDeny="Cancelar"
      />
    </div>
  );
}
