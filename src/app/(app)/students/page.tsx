"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { PageHeader } from "@/components/page-header";
import { Mail, Phone, Calendar, Users, CakeIcon, Edit } from "lucide-react";
import { Chip } from "@/components/ui/chip";

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

  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.turma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Alunos"
          subtitle="Cadastre e administre os seus alunos."
        />
        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Buscar alunos..."
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
          />
          <Button >
            Novo aluno
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStudents.map((student) => (
          <Card
            key={student.id}
            className="hover:-translate-y-1 cursor-pointer transition duration-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar
                  src={student.avatar}
                  alt={student.name}
                  fallback={student.name.charAt(0).toUpperCase()}
                  className="h-12 w-12"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground">
                    {student.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Chip
                      label={`${student.age} anos`}
                      color="default"
                      size="sm"
                      startIcon={CakeIcon}
                    />
                  </div>
                </div>
                <Link href={`/students/edit/${student.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
