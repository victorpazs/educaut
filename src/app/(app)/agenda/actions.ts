"use server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { IAgendaSchedule } from "./_models";

export async function getAgenda(): Promise<
  ApiResponse<IAgendaSchedule[] | null>
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

    const schedules = await prisma.schedules.findMany({
      where: {
        school_id: schoolId,
        status: 1,
        schedules_students: {
          some: {
            students: {
              status: 1,
            },
          },
        },
      },
      orderBy: {
        start_time: "asc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        start_time: true,
        end_time: true,
        status: true,
        schedules_students: {
          select: {
            students: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return createSuccessResponse(schedules, "Agenda carregada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}

export async function deleteScheduleAction(
  id: number
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

    if (!id || isNaN(Number(id))) {
      return createErrorResponse(
        "ID do agendamento inválido.",
        "VALIDATION_ERROR",
        400
      );
    }

    const existingAny = await prisma.schedules.findFirst({
      where: { id: Number(id), school_id: schoolId },
      select: { id: true, status: true },
    });
    if (!existingAny) {
      return createErrorResponse(
        "Agendamento não encontrado.",
        "NOT_FOUND",
        404
      );
    }
    if (existingAny.status === 3) {
      return createSuccessResponse(
        { id: Number(id) },
        "Aula removida com sucesso."
      );
    }

    await prisma.schedules.update({
      where: { id: Number(id) },
      data: { status: 3 },
    });

    return createSuccessResponse(
      { id: Number(id) },
      "Aula removida com sucesso."
    );
  } catch (error) {
    return handleServerError(error);
  }
}

export async function getScheduleById(
  id: number
): Promise<ApiResponse<IAgendaSchedule | null>> {
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

    const schedule = await prisma.schedules.findFirst({
      where: {
        id,
        school_id: schoolId,
        status: 1,
        schedules_students: {
          some: {
            students: {
              status: 1,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        start_time: true,
        end_time: true,
        status: true,
        schedules_students: {
          select: {
            students: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      return createErrorResponse(
        "Agendamento não encontrado.",
        "NOT_FOUND",
        404
      );
    }

    return createSuccessResponse(
      schedule,
      "Agendamento carregado com sucesso."
    );
  } catch (error) {
    return handleServerError(error);
  }
}

type CreateScheduleInput = {
  title: string;
  description?: string;
  start: Date | string;
  end: Date | string;
  studentIds: number[];
  activityIds?: number[];
};

export async function createScheduleAction(
  input: CreateScheduleInput
): Promise<ApiResponse<IAgendaSchedule | null>> {
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

    const title = input.title?.trim();
    if (!title) {
      return createErrorResponse(
        "Título é obrigatório.",
        "VALIDATION_ERROR",
        400
      );
    }

    if (
      !input.studentIds ||
      !Array.isArray(input.studentIds) ||
      input.studentIds.length === 0
    ) {
      return createErrorResponse(
        "Selecione pelo menos um aluno.",
        "VALIDATION_ERROR",
        400
      );
    }

    const startDate = new Date(input.start);
    const endDate = new Date(input.end);
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      return createErrorResponse(
        "Data de início inválida.",
        "VALIDATION_ERROR",
        400
      );
    }
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      return createErrorResponse(
        "Data de fim inválida.",
        "VALIDATION_ERROR",
        400
      );
    }
    if (startDate.getTime() >= endDate.getTime()) {
      return createErrorResponse(
        "A data de início deve ser anterior à data de fim.",
        "VALIDATION_ERROR",
        400
      );
    }

    // Validar que todos os alunos existem e pertencem à escola
    const students = await prisma.students.findMany({
      where: {
        id: { in: input.studentIds },
        school_id: schoolId,
        status: 1,
      },
      select: { id: true },
    });

    if (students.length !== input.studentIds.length) {
      return createErrorResponse(
        "Um ou mais alunos são inválidos para a escola selecionada.",
        "VALIDATION_ERROR",
        400
      );
    }

    const created = await prisma.$transaction(async (tx) => {
      // Verificar se já existe um schedule igual (mesmo horário e escola)
      const existingSame = await tx.schedules.findFirst({
        where: {
          school_id: schoolId,
          start_time: startDate,
          end_time: endDate,
          status: 1,
        },
        select: {
          id: true,
          title: true,
          description: true,
          start_time: true,
          end_time: true,
          status: true,
          schedules_students: {
            select: {
              students: {
                select: { id: true, name: true, status: true },
              },
            },
          },
        },
      });

      let schedule;
      if (existingSame) {
        schedule = existingSame;
      } else {
        schedule = await tx.schedules.create({
          data: {
            school_id: schoolId,
            title,
            description: input.description ?? null,
            start_time: startDate,
            end_time: endDate,
            status: 1,
          },
          select: {
            id: true,
            title: true,
            description: true,
            start_time: true,
            end_time: true,
            status: true,
            schedules_students: {
              select: {
                students: {
                  select: { id: true, name: true, status: true },
                },
              },
            },
          },
        });
      }

      // Remover alunos existentes e adicionar os novos
      await tx.schedules_students.deleteMany({
        where: { schedule_id: schedule.id },
      });

      await tx.schedules_students.createMany({
        data: input.studentIds.map((student_id) => ({
          schedule_id: schedule.id,
          student_id,
        })),
        skipDuplicates: true,
      });

      // Vincular atividades
      if (input.activityIds && input.activityIds.length > 0) {
        await tx.schedules_activities.deleteMany({
          where: { schedule_id: schedule.id },
        });

        await tx.schedules_activities.createMany({
          data: input.activityIds.map((activity_id) => ({
            schedule_id: schedule.id,
            activity_id,
          })),
          skipDuplicates: true,
        });
      }

      // Recarregar schedule com alunos
      const scheduleWithStudents = await tx.schedules.findUnique({
        where: { id: schedule.id },
        select: {
          id: true,
          title: true,
          description: true,
          start_time: true,
          end_time: true,
          status: true,
          schedules_students: {
            select: {
              students: {
                select: { id: true, name: true, status: true },
              },
            },
          },
        },
      });

      return scheduleWithStudents!;
    });

    return createSuccessResponse(created, "Aula criada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}

type UpdateScheduleInput = {
  id: number;
  title: string;
  description?: string;
  start: Date | string;
  end: Date | string;
  studentIds: number[];
  activityIds?: number[];
};

export async function updateScheduleAction(
  input: UpdateScheduleInput
): Promise<ApiResponse<IAgendaSchedule | null>> {
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

    if (!input.id || isNaN(Number(input.id))) {
      return createErrorResponse(
        "ID do agendamento inválido.",
        "VALIDATION_ERROR",
        400
      );
    }

    const existing = await prisma.schedules.findFirst({
      where: { id: input.id, school_id: schoolId, status: 1 },
      select: { id: true },
    });
    if (!existing) {
      return createErrorResponse(
        "Agendamento não encontrado.",
        "NOT_FOUND",
        404
      );
    }

    const title = input.title?.trim();
    if (!title) {
      return createErrorResponse(
        "Título é obrigatório.",
        "VALIDATION_ERROR",
        400
      );
    }

    const startDate = new Date(input.start);
    const endDate = new Date(input.end);
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      return createErrorResponse(
        "Data de início inválida.",
        "VALIDATION_ERROR",
        400
      );
    }
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      return createErrorResponse(
        "Data de fim inválida.",
        "VALIDATION_ERROR",
        400
      );
    }
    if (startDate.getTime() >= endDate.getTime()) {
      return createErrorResponse(
        "A data de início deve ser anterior à data de fim.",
        "VALIDATION_ERROR",
        400
      );
    }

    if (
      !input.studentIds ||
      !Array.isArray(input.studentIds) ||
      input.studentIds.length === 0
    ) {
      return createErrorResponse(
        "Selecione pelo menos um aluno.",
        "VALIDATION_ERROR",
        400
      );
    }

    // Validar que todos os alunos existem e pertencem à escola
    const students = await prisma.students.findMany({
      where: {
        id: { in: input.studentIds },
        school_id: schoolId,
        status: 1,
      },
      select: { id: true },
    });

    if (students.length !== input.studentIds.length) {
      return createErrorResponse(
        "Um ou mais alunos são inválidos para a escola selecionada.",
        "VALIDATION_ERROR",
        400
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Atualizar dados do schedule
      const schedule = await tx.schedules.update({
        where: { id: input.id },
        data: {
          title,
          description: input.description ?? null,
          start_time: startDate,
          end_time: endDate,
        },
        select: {
          id: true,
          title: true,
          description: true,
          start_time: true,
          end_time: true,
          status: true,
        },
      });

      // Sincronizar alunos
      await tx.schedules_students.deleteMany({
        where: { schedule_id: input.id },
      });

      await tx.schedules_students.createMany({
        data: input.studentIds.map((student_id) => ({
          schedule_id: input.id,
          student_id,
        })),
        skipDuplicates: true,
      });

      // Sincronizar atividades
      await tx.schedules_activities.deleteMany({
        where: { schedule_id: input.id },
      });

      if (input.activityIds && input.activityIds.length > 0) {
        await tx.schedules_activities.createMany({
          data: input.activityIds.map((activity_id) => ({
            schedule_id: input.id,
            activity_id,
          })),
          skipDuplicates: true,
        });
      }

      // Recarregar schedule com alunos
      const scheduleWithStudents = await tx.schedules.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          title: true,
          description: true,
          start_time: true,
          end_time: true,
          status: true,
          schedules_students: {
            select: {
              students: {
                select: { id: true, name: true, status: true },
              },
            },
          },
        },
      });

      return scheduleWithStudents!;
    });

    return createSuccessResponse(updated, "Aula atualizada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}

export async function getScheduleActivities(
  scheduleId: number
): Promise<ApiResponse<number[] | null>> {
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

    const schedule = await prisma.schedules.findFirst({
      where: {
        id: scheduleId,
        school_id: schoolId,
        status: 1,
      },
      select: { id: true },
    });

    if (!schedule) {
      return createErrorResponse("Aula não encontrada.", "NOT_FOUND", 404);
    }

    const activities = await prisma.schedules_activities.findMany({
      where: { schedule_id: scheduleId },
      select: { activity_id: true },
    });

    const activityIds = activities.map((a) => a.activity_id);

    return createSuccessResponse(
      activityIds,
      "Atividades carregadas com sucesso."
    );
  } catch (error) {
    return handleServerError(error);
  }
}

export async function getScheduleActivityNotes(
  scheduleId: number
): Promise<ApiResponse<Record<number, string | null> | null>> {
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

    const schedule = await prisma.schedules.findFirst({
      where: {
        id: scheduleId,
        school_id: schoolId,
        status: 1,
      },
      select: { id: true },
    });

    if (!schedule) {
      return createErrorResponse("Aula não encontrada.", "NOT_FOUND", 404);
    }

    const activities = await prisma.schedules_activities.findMany({
      where: { schedule_id: scheduleId },
      select: { activity_id: true, note: true },
    });

    const notesMap: Record<number, string | null> = {};
    activities.forEach((a) => {
      notesMap[a.activity_id] = a.note;
    });

    return createSuccessResponse(
      notesMap,
      "Notas das atividades carregadas com sucesso."
    );
  } catch (error) {
    return handleServerError(error);
  }
}
