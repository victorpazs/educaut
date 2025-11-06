"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StudentCreateSteps, StudentFormData } from "./_models";
import { StudentTabContent } from "./_components/StudentTabContent";
import { TabsSidebar } from "@/components/tabs-sidebar";
import { useAttributes } from "@/hooks/useAttributes";
import { getAttributeIcon, getAttributeLabel } from "@/lib/attributes.utils";
import { SubmitActions } from "./_components/SubmitActions";

export default function CreateStudentPage() {
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

  const handleBack = React.useCallback(() => {
    router.push("/students");
  }, [router]);

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
            title="Novo aluno"
            subtitle="Cadastre um novo aluno na plataforma."
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
          <StudentTabContent
            activeTab={activeTab}
            formData={formData}
            setFormData={setFormData}
          />

          <SubmitActions
            formData={formData}
            currentStep={activeTab}
            handleBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}
