"use server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import {
  ApiResponse,
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
} from "@/lib/server-responses";

export type SchoolStudentOption = {
  value: number;
  label: string;
};

export async function getSchoolStudentsOptions(): Promise<
  ApiResponse<SchoolStudentOption[] | null>
> {
  try {
    const { school } = await getAuthContext();
    const schoolId = school?.id;

    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400
      );
    }

    const students = await prisma.students.findMany({
      where: {
        school_id: schoolId,
        status: {
          not: 3,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const options: SchoolStudentOption[] = students.map((s) => ({
      value: s.id,
      label: s.name,
    }));

    return createSuccessResponse(options, "Estudantes carregados com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}


