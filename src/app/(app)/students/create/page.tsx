"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { StudentFormData } from "./_types";
import { StudentStepper } from "./_components";

export default function CreateStudentPage() {
  const router = useRouter();

  const handleSubmit = async (formData: StudentFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Creating student:", formData);
    router.push("/students");
  };

  const handleBack = () => {
    router.push("/students");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Criar Novo Aluno"
        subtitle="Adicione um novo aluno ao sistema seguindo as etapas."
        goBack={handleBack}
      />

      <StudentStepper onSubmit={handleSubmit} onCancel={handleBack} />
    </div>
  );
}
