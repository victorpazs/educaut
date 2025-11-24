"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  StudentCreateSteps,
  StudentFormData,
} from "@/app/(app)/students/create/_models";
import { TabsSidebar } from "@/components/tabs-sidebar";
import { useAttributes } from "@/hooks/useAttributes";
import { getAttributeIcon, getAttributeLabel } from "@/lib/attributes.utils";
import { StudentTabContent } from "@/app/(app)/students/_components/StudentTabContent";
import { SubmitActions } from "@/app/(app)/students/edit/_components/SubmitActions";
import {
  getStudentById,
  deleteStudentAction,
} from "@/app/(app)/students/actions";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { toast } from "@/lib/toast";

export default function EditStudentPage() {
  const params = useParams<{ id: string }>();
  const { attributeTypes } = useAttributes();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<StudentCreateSteps>(
    StudentCreateSteps.BASIC_INFO
  );
  const [formData, setFormData] = React.useState<StudentFormData>({
    name: "",
    birthday: new Date(),
    school_year: 0,
    school_segment: "",
    tea_support_level: null,
    non_verbal: null,
    description: "",
    student_attributes: [],
  });
  const [studentId, setStudentId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleBack = React.useCallback(() => {
    router.push("/students");
  }, [router]);

  React.useEffect(() => {
    const load = async () => {
      const idParam = params?.id;
      const idNum = Number(idParam);
      if (!idParam || isNaN(idNum)) {
        handleBack();
        return;
      }
      const res = await getStudentById(idNum);
      if (!res.success || !res.data || res.data.status !== 1) {
        handleBack();
        return;
      }
      const s = res.data;
      setStudentId(s.id);
      setFormData({
        name: s.name ?? "",
        birthday: s.birthday ? new Date(s.birthday) : new Date(),
        school_year: s.school_year ?? 0,
        school_segment: s.school_segment ?? "",
        tea_support_level: s.tea_support_level ?? null,
        non_verbal: s.non_verbal ?? null,
        description: s.description ?? "",
        student_attributes:
          s.student_attributes?.map((sa) => sa.attribute_id) ?? [],
      });
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const options = React.useMemo(
    () => [
      {
        label: "Informações básicas",
        identifier: StudentCreateSteps.BASIC_INFO,
        icon: User,
      },
      ...attributeTypes?.map((type) => ({
        label: getAttributeLabel(type),
        identifier: type as StudentCreateSteps,
        icon: getAttributeIcon(type),
      })),
      {
        label: "Atividades trabalhadas",
        identifier: StudentCreateSteps.WORKED_ACTIVITIES,
        icon: getAttributeIcon("worked-activities"),
      },
    ],
    [attributeTypes]
  );

  const handleTabClick = React.useCallback((identifier: string) => {
    setActiveTab(identifier as StudentCreateSteps);
  }, []);

  const handleDelete = React.useCallback(async () => {
    if (!studentId) return;
    setOpenDeleteDialog(false);
    const res = await deleteStudentAction(studentId);
    if (!res.success) {
      toast.error("Erro", res.message || "Não foi possível excluir o aluno.");
      return;
    }
    toast.success("Sucesso", "Aluno excluído com sucesso.");
    router.push("/students");
  }, [studentId, router]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Editar aluno"
            subtitle="Atualize os dados do aluno."
            goBack={handleBack}
            actions={
              !loading && studentId ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir aluno
                </Button>
              ) : null
            }
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
            <StudentTabContent
              activeTab={activeTab}
              formData={formData}
              setFormData={setFormData}
              studentId={studentId}
            />
          )}

          {!loading && studentId !== null && (
            <SubmitActions
              studentId={studentId}
              formData={formData}
              currentStep={activeTab}
              handleBack={handleBack}
            />
          )}
        </div>
      </div>
      <ConfirmationDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title="Excluir aluno"
        description={`Tem certeza que deseja excluir este aluno? Esta ação não poderá ser desfeita.`}
        labelAccept="Excluir"
        labelDeny="Cancelar"
        onAccept={handleDelete}
      />
    </div>
  );
}
