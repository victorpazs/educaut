"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { CheckboxField, StudentFormData } from "./_models";
import { StudentTabContent } from "./_components/StudentTabContent";
import { TabsSidebar } from "@/components/tabs-sidebar";

export default function CreateStudentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<string>("basic-info");
  const [formData, setFormData] = React.useState<StudentFormData>({
    name: "",
    age: "",
    segment: "",
    tea: "",
    otherDisorders: [],
    communication: "",
    hyperfocus: [],
    preferences: [],
    difficulties: [],
    observation: "",
  });

  const handleSubmit = async (formData: StudentFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Creating student:", formData);
    router.push("/students");
  };

  const handleBack = () => {
    router.push("/students");
  };

  const options = [
    {
      label: "Informações Básicas",
      identifier: "basic-info",
      icon: User,
    },
  ];

  const handleTabClick = (identifier: string) => {
    setActiveTab(identifier);
  };

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (
    field: CheckboxField,
    option: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], option]
        : prev[field].filter((item) => item !== option),
    }));
  };

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
            options={options.map((opt) => ({
              ...opt,
              onClick: handleTabClick,
            }))}
          />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <StudentTabContent
            activeTab={activeTab}
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
          />
        </div>
      </div>
    </div>
  );
}
