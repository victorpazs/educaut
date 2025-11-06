"use server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

export type CreateStudentInput = {
  name: string;
  school_segment: string;
  school_year: number;
  description?: string | null;
  tea_support_level?: number | null;
  non_verbal?: boolean | null;
  birthday?: Date | null;
  student_attributes?: number[];
};

export async function createStudentAction(
  input: CreateStudentInput
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

    const created = await prisma.students.create({
      data: {
        name: input.name,
        school_segment: input.school_segment,
        school_year: input.school_year,
        description: input.description || undefined,
        tea_support_level: input.tea_support_level ?? undefined,
        non_verbal: input.non_verbal ?? undefined,
        birthday: input.birthday ?? undefined,
        school_id: schoolId,
      },
      select: { id: true },
    });

    if (!created) {
      return createErrorResponse(
        "Não foi possível criar o aluno.",
        "FAILED_TO_CREATE_STUDENT",
        500
      );
    }

    if (input.student_attributes && input.student_attributes.length > 0) {
      await prisma.student_attributes.createMany({
        data: input.student_attributes.map((attribute_id) => ({
          student_id: created.id,
          attribute_id,
        })),
        skipDuplicates: true,
      });
    }

    return createSuccessResponse(created, "Aluno criado com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
