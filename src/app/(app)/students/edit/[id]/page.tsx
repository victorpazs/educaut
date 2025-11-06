"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { User } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  StudentCreateSteps,
  StudentFormData,
} from "@/app/(app)/students/create/_models";
import { StudentTabContent } from "@/app/(app)/students/create/_components/StudentTabContent";
import { TabsSidebar } from "@/components/tabs-sidebar";
import { useAttributes } from "@/hooks/useAttributes";
import { getAttributeIcon, getAttributeLabel } from "@/lib/attributes.utils";
import { SubmitActions } from "@/app/(app)/students/edit/_components/SubmitActions";
import { getStudentById } from "@/app/(app)/students/actions";

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
        label: "Informações Básicas",
        identifier: StudentCreateSteps.BASIC_INFO,
        icon: User,
      },
      ...attributeTypes?.map((type) => ({
        label: getAttributeLabel(type),
        identifier: type as StudentCreateSteps,
        icon: getAttributeIcon(type),
      })),
    ],
    [attributeTypes]
  );

  const handleTabClick = React.useCallback((identifier: string) => {
    setActiveTab(identifier as StudentCreateSteps);
  }, []);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Editar aluno"
            subtitle="Atualize os dados do aluno."
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
            <StudentTabContent
              activeTab={activeTab}
              formData={formData}
              setFormData={setFormData}
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
    </div>
  );
}
