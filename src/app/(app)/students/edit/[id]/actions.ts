"use server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

export type UpdateStudentInput = {
  name: string;
  school_segment: string;
  school_year: number;
  description?: string | null;
  diagnosis?: string | null;
  responsible?: string[];
  tea_support_level?: number | null;
  non_verbal?: boolean | null;
  birthday?: Date | null;
  student_attributes?: number[];
};

export async function updateStudentAction(
  studentId: number,
  input: UpdateStudentInput
): Promise<ApiResponse<{ id: number } | null>> {
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

    if (!studentId || isNaN(studentId)) {
      return createErrorResponse(
        "ID do aluno inválido.",
        "INVALID_STUDENT_ID",
        400
      );
    }

    const existing = await prisma.students.findFirst({
      where: { id: studentId, school_id: schoolId },
      select: { id: true },
    });

    if (!existing) {
      return createErrorResponse(
        "Aluno não encontrado ou não pertence à escola selecionada.",
        "STUDENT_NOT_FOUND",
        404
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.students.update({
        where: { id: studentId },
        data: {
          name: input.name,
          school_segment: input.school_segment,
          school_year: input.school_year,
          description: input.description ?? null,
          diagnosis: input.diagnosis?.trim() || null,
          responsible: input.responsible || [],
          tea_support_level: input.tea_support_level ?? null,
          non_verbal: input.non_verbal ?? null,
          birthday: input.birthday ?? null,
        },
      });

      if (Array.isArray(input.student_attributes)) {
        await tx.student_attributes.deleteMany({
          where: { student_id: studentId },
        });
        if (input.student_attributes.length > 0) {
          await tx.student_attributes.createMany({
            data: input.student_attributes.map((attribute_id) => ({
              student_id: studentId,
              attribute_id,
            })),
            skipDuplicates: true,
          });
        }
      }
    });

    return createSuccessResponse(
      { id: studentId },
      "Aluno atualizado com sucesso."
    );
  } catch (error) {
    return handleServerError(error);
  }
}
