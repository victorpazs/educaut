"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IStudent } from "../_models";

import { StudentCell } from "./Cell";

type Props = {
  students: IStudent[];
  onDelete?: (id: number) => Promise<void>;
};

export function StudentsList({ students, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead align="left">Nome</TableHead>
          <TableHead align="left">Idade</TableHead>
          <TableHead align="left">Ano letivo</TableHead>
          <TableHead align="left">Segmento</TableHead>
          <TableHead align="left">Próxima aula</TableHead>
          <TableHead align="left" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => {
          return (
            <StudentCell
              key={student.id}
              student={student}
              onDelete={onDelete}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}
