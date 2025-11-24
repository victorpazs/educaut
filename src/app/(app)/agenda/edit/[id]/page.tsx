"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, FileText } from "lucide-react";
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
} from "@/app/(app)/agenda/actions";

export default function EditSchedulePage() {
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
    studentId: null,
    activityIds: [],
  });
  const [scheduleId, setScheduleId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const handleBack = React.useCallback(() => {
    router.push("/agenda");
  }, [router]);

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

      setFormData({
        title: s.title ?? "",
        description: s.description ?? "",
        start:
          s.start_time instanceof Date ? s.start_time : new Date(s.start_time),
        end: s.end_time instanceof Date ? s.end_time : new Date(s.end_time),
        studentId: s.student_id,
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
        icon: Calendar,
      },
      {
        label: "Horário",
        identifier: ScheduleCreateSteps.TIME_INFO,
        icon: Calendar,
      },
      {
        label: "Atividades trabalhadas",
        identifier: ScheduleCreateSteps.ACTIVITIES,
        icon: FileText,
      },
    ],
    []
  );

  const handleTabClick = React.useCallback((identifier: string) => {
    setActiveTab(identifier as ScheduleCreateSteps);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Editar aula"
            subtitle={`Atualize os dados da aula ${formData.title || ""}`}
            goBack={handleBack}
          />
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
    </div>
  );
}
