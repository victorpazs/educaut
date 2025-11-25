"use server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import { revalidatePath } from "next/cache";
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
        birthday: true,
        school_year: true,
        created_at: true,
        status: true,
        school_segment: true,
        schedules: {
          where: {
            status: 1,
            start_time: {
              gt: new Date(),
            },
          },
          orderBy: {
            start_time: "asc",
          },
          take: 1,
          select: {
            start_time: true,
          },
        },
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
        birthday: true,
        school_year: true,
        school_segment: true,
        tea_support_level: true,
        non_verbal: true,
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

export async function deleteStudentAction(
  studentId: number
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

    if (!studentId || isNaN(Number(studentId))) {
      return createErrorResponse(
        "ID do aluno inválido.",
        "INVALID_STUDENT_ID",
        400
      );
    }

    const existing = await prisma.students.findFirst({
      where: {
        id: Number(studentId),
        school_id: schoolId,
        status: {
          not: 3,
        },
      },
      select: { id: true },
    });

    if (!existing) {
      return createNotFoundError(
        "Aluno não encontrado ou não pertence à escola selecionada."
      );
    }

    await prisma.students.update({
      where: { id: Number(studentId), school_id: schoolId, status: { not: 3 } },
      data: { status: 3 },
    });

    revalidatePath("/students");

    return createSuccessResponse(
      { id: Number(studentId) },
      "Aluno removido com sucesso."
    );
  } catch (error) {
    return handleServerError(error);
  }
}

export interface IWorkedActivity {
  schedule_id: number;
  activity_id: number;
  activity_name: string;
  activity_content: unknown;
  activity_tags: string[];
  schedule_title: string;
  schedule_start: Date;
  schedule_end: Date;
  note: string | null;
}

export async function getWorkedActivitiesByStudent(
  studentId: number
): Promise<ApiResponse<IWorkedActivity[] | null>> {
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

    if (!studentId || isNaN(Number(studentId))) {
      return createErrorResponse(
        "ID do aluno inválido.",
        "INVALID_STUDENT_ID",
        400
      );
    }

    const workedActivities = await prisma.schedules_activities.findMany({
      where: {
        schedules: {
          student_id: Number(studentId),
          school_id: schoolId,
          status: {
            not: 3,
          },
        },
        activities: {
          status: {
            not: 3,
          },
        },
      },
      include: {
        schedules: {
          select: {
            start_time: true,
            end_time: true,
            title: true,
          },
        },
        activities: {
          select: {
            name: true,
            content: true,
            tags: true,
          },
        },
      },
    });

    const result: IWorkedActivity[] = workedActivities
      .map((sa) => ({
        schedule_id: sa.schedule_id,
        activity_id: sa.activity_id,
        activity_name: sa.activities.name,
        activity_content: sa.activities.content,
        activity_tags: sa.activities.tags,
        schedule_title: sa.schedules.title ?? "",
        schedule_start: sa.schedules.start_time,
        schedule_end: sa.schedules.end_time,
        note: sa.note,
      }))
      .sort((a, b) => {
        const dateA =
          a.schedule_start instanceof Date
            ? a.schedule_start
            : new Date(a.schedule_start);
        const dateB =
          b.schedule_start instanceof Date
            ? b.schedule_start
            : new Date(b.schedule_start);
        return dateB.getTime() - dateA.getTime();
      });

    return createSuccessResponse(result, "Atividades trabalhadas encontradas.");
  } catch (error) {
    return handleServerError(error);
  }
}

export async function updateScheduleActivityNote(
  scheduleId: number,
  activityId: number,
  note: string
): Promise<ApiResponse<null>> {
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

    await prisma.schedules_activities.update({
      where: {
        schedule_id_activity_id: {
          schedule_id: scheduleId,
          activity_id: activityId,
        },
      },
      data: {
        note: note.trim() || null,
      },
    });

    return createSuccessResponse(null, "Anotação atualizada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
