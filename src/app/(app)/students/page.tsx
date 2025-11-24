"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyList } from "@/components/empty-list";

import { useStudents } from "./_hooks/use-students";
import { PageLoader } from "@/components/page-loader";

import { Card } from "@/components/ui/card";
import { StudentsList } from "./_components/List";

export default function StudentsPage() {
  const [search, setSearch] = React.useState("");
  const { students, isLoading, hasError, hasSchool, onDelete } =
    useStudents(search);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PageHeader
            title="Alunos"
            subtitle="Cadastre e administre os seus alunos."
            actions={
              <div className="flex items-center justify-end flex-wrap gap-3">
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
            <Card className="rounded-sm">
              <StudentsList students={students} onDelete={onDelete} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
