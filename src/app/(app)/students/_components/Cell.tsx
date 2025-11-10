import { useState } from "react";
import { IStudent } from "../_models";
import { TableCell } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { getSchoolYearLabel } from "@/lib/school_year.utils";
import { formatDate, getAge } from "@/lib/utils";
import { deleteStudentAction } from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import Link from "next/link";

export function StudentCell({ student }: { student: IStudent }) {
  const router = useRouter();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const age = getAge(student.birthday);
  const nextStart = student.schedules?.[0]?.start_time ?? null;
  const nextStartFormatted = nextStart != null ? formatDate(nextStart) : "--";
  const schoolYearLabel = getSchoolYearLabel(student.school_year);

  const handleDelete = async (id: number) => {
    setOpenDeleteDialog(false);
    const res = await deleteStudentAction(id);
    if (!res.success) {
      toast.error("Erro", res.message || "Não foi possível excluir o aluno.");
      return;
    }
    toast.success("Sucesso", "Aluno excluído com sucesso.");
    router.refresh();
  };

  return (
    <TableRow key={student.id}>
      <TableCell>{student.name}</TableCell>
      <TableCell>{age ?? "-"}</TableCell>
      <TableCell>{schoolYearLabel ?? "-"}</TableCell>
      <TableCell>{student.school_segment ?? "-"}</TableCell>
      <TableCell>{nextStartFormatted}</TableCell>
      <TableCell className="text-right">
        <Link href={`/students/edit/${student.id}`}>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 text-red-600 hover:text-red-700"
          aria-label="Excluir aluno"
          title="Excluir aluno"
          onClick={() => setOpenDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <ConfirmationDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          title="Excluir aluno"
          description={`Tem certeza que deseja excluir "${student.name}"? Esta ação não poderá ser desfeita.`}
          labelAccept="Excluir"
          labelDeny="Cancelar"
          onAccept={() => handleDelete(student.id)}
        />
      </TableCell>
    </TableRow>
  );
}
