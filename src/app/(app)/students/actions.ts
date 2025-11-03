"use server";

import { prisma } from "@/lib/prisma";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { IStudent } from "./_models";

interface GetStudentsParams {
  search?: string;
  schoolId?: number | null;
}

export async function getStudents({
  search,
  schoolId,
}: GetStudentsParams): Promise<ApiResponse<IStudent[] | null>> {
  try {
    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400
      );
    }

    const normalizedSearch = search?.trim();

    const students = await prisma.students.findMany({
      where: {
        school_id: schoolId,
        status: {
          not: 3,
        },
        ...(normalizedSearch
          ? {
              name: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            }
          : {}),
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        birth_year: true,
        school_year: true,
        created_at: true,
        status: true,
        school_segment: true,
      },
    });

    return createSuccessResponse(students, "Alunos carregados com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
