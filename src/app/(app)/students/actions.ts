"use server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import {
  createErrorResponse,
  createSuccessResponse,
  createNotFoundError,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { IStudent, IStudentDetail } from "./_models";

interface GetStudentsParams {
  search?: string;
}

export async function getStudents({
  search,
}: GetStudentsParams): Promise<ApiResponse<IStudent[] | null>> {
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

export async function getStudentById(
  studentId: number
): Promise<ApiResponse<IStudentDetail | null>> {
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

    const student = await prisma.students.findFirst({
      where: {
        id: studentId,
        school_id: schoolId,
        status: {
          not: 3,
        },
      },
      select: {
        id: true,
        name: true,
        birth_year: true,
        school_year: true,
        school_segment: true,
        tea_support_level: true,
        communication: true,
        description: true,
        created_at: true,
        status: true,
        school_id: true,
        student_attributes: {
          select: {
            attribute_id: true,
            attributes: {
              select: {
                id: true,
                name: true,
                type_id: true,
                attribute_types: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return createNotFoundError(
        "Aluno não encontrado ou não pertence à escola selecionada."
      );
    }

    return createSuccessResponse(student, "Aluno carregado com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
