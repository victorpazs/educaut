import { useState } from "react";
import { IStudent } from "../_models";
import { TableCell } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { getSchoolYearLabel } from "@/lib/school_year.utils";
import { formatDate, getAge } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditButton } from "@/components/edit-button";
import { DeleteButton } from "@/components/delete-button";

export function StudentCell({
  student,
  onDelete,
}: {
  student: IStudent;
  onDelete?: (id: number) => Promise<void>;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const age = getAge(student.birthday);
  const nextStart = student.schedules?.[0]?.start_time ?? null;
  const nextStartFormatted = nextStart != null ? formatDate(nextStart) : "--";
  const schoolYearLabel = getSchoolYearLabel(student.school_year);
  const router = useRouter();
  const handleDelete = async (id: number) => {
    setOpenDeleteDialog(false);
    if (onDelete) {
      await onDelete(id);
    }
  };

  return (
    <TableRow
      className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
      onClick={() => router.push(`/students/edit/${student.id}`)}
      key={student.id}
    >
      <TableCell>{student.name}</TableCell>
      <TableCell>{age ?? "-"}</TableCell>
      <TableCell>{schoolYearLabel ?? "-"}</TableCell>
      <TableCell>{student.school_segment ?? "-"}</TableCell>
      <TableCell>{nextStartFormatted}</TableCell>
      <TableCell className="text-right">
        <Link href={`/students/edit/${student.id}`}>
          <EditButton title="Editar aluno" />
        </Link>

        <DeleteButton
          onClick={() => setOpenDeleteDialog(true)}
          title="Excluir aluno"
        />
        <ConfirmationDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          title="Excluir aluno"
          description={`Tem certeza que deseja excluir o aluno "${student.name}"? Esta ação não poderá ser desfeita.`}
          labelAccept="Excluir"
          labelDeny="Cancelar"
          onAccept={() => {
            handleDelete(student.id);
          }}
        />
      </TableCell>
    </TableRow>
  );
}
