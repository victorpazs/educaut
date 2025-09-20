"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { PageHeader } from "@/components/page-header";
import { StudentCard } from "./_components/student-card";
import { Plus } from "lucide-react";

// Mock data for students
const mockStudents = [
  {
    id: 1,
    name: "Ana Silva",
    avatar: null,
    age: 12,
    phone: "(11) 99999-9999",
    turma: "Turma A",
    idade: 8,
    dataMatricula: "15/03/2024",
    status: "Ativo",
  },
  {
    id: 2,
    name: "Carlos Santos",
    avatar: null,
    age: 12,
    phone: "(11) 88888-8888",
    turma: "Turma B",
    idade: 9,
    dataMatricula: "20/02/2024",
    status: "Ativo",
  },
  {
    id: 3,
    name: "Maria Oliveira",
    avatar: null,
    age: 12,
    phone: "(11) 77777-7777",
    turma: "Turma A",
    idade: 7,
    dataMatricula: "10/01/2024",
    status: "Ativo",
  },
  {
    id: 4,
    name: "João Costa",
    avatar: null,
    age: 12,
    phone: "(11) 66666-6666",
    turma: "Turma C",
    idade: 8,
    dataMatricula: "05/04/2024",
    status: "Inativo",
  },
  {
    id: 5,
    name: "Sofia Ferreira",
    avatar: null,
    age: 12,
    phone: "(11) 55555-5555",
    turma: "Turma B",
    idade: 9,
    dataMatricula: "25/03/2024",
    status: "Ativo",
  },
  {
    id: 6,
    name: "Pedro Lima",
    avatar: null,
    age: 12,
    phone: "(11) 44444-4444",
    turma: "Turma A",
    idade: 8,
    dataMatricula: "12/02/2024",
    status: "Ativo",
  },
];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.turma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alunos"
        subtitle="Cadastre e administre os seus alunos."
        actions={
          <div className="flex items-center gap-3">
            <SearchInput
              placeholder="Buscar alunos..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
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

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStudents.map((student) => (
          <StudentCard {...student} />
        ))}
      </div>
    </div>
  );
}
