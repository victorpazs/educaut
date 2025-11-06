"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";

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
            <Empty>
              <EmptyMedia variant="icon">
                <Users className="h-6 w-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Selecione uma escola</EmptyTitle>
                <EmptyDescription>
                  É necessário escolher uma escola para visualizar os alunos.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : hasError ? (
            <Empty>
              <EmptyMedia variant="icon">
                <Users className="h-6 w-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Erro ao carregar alunos</EmptyTitle>
                <EmptyDescription>
                  Não foi possível carregar os alunos. Tente novamente em
                  instantes.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : isLoading ? (
            <PageLoader />
          ) : students.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <Users className="h-6 w-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Nenhum aluno encontrado</EmptyTitle>
                <EmptyDescription>
                  Ajuste os filtros de busca ou cadastre um novo aluno.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
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
