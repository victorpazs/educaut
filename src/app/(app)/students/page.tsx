"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyList } from "@/components/empty-list";

import { StudentCard } from "./_components/student-card";
import { useStudents } from "./_hooks/use-students";
import { PageLoader } from "@/components/page-loader";

export default function StudentsPage() {
  const [search, setSearch] = React.useState("");
  const { students, isLoading, hasError, hasSchool } = useStudents(search);

  const handleSearch = (value: string) => {
    setSearch(value);
  };
  console.log(students);
  console.log(isLoading);
  console.log(hasError);
  console.log(hasSchool);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Alunos"
            subtitle="Cadastre e administre os seus alunos."
            actions={
              <div className="flex items-center gap-3">
                <SearchInput
                  placeholder="Buscar alunos..."
                  value={search}
                  onSearch={handleSearch}
                />
                <Link href="/students/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo aluno
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
        <div className="col-span-12">
          {!hasSchool ? (
            <EmptyList
              title="Selecione uma escola"
              description="É necessário escolher uma escola para visualizar os alunos."
              icon={Users}
            />
          ) : hasError ? (
            <EmptyList
              title="Erro ao carregar alunos"
              description="Não foi possível carregar os alunos. Tente novamente em instantes."
              icon={Users}
            />
          ) : isLoading ? (
            <PageLoader />
          ) : students.length === 0 ? (
            <EmptyList
              title="Nenhum aluno encontrado"
              description="Ajuste os filtros de busca ou cadastre um novo aluno."
              icon={Users}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <StudentCard key={student.id} {...student} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
