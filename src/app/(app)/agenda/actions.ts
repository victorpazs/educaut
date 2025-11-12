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
        students: {
          status: 1,
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
        student_id: true,
        students: {
          select: {
            id: true,
            name: true,
            status: true,
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
        students: {
          status: 1,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        start_time: true,
        end_time: true,
        status: true,
        student_id: true,
        students: {
          select: {
            id: true,
            name: true,
            status: true,
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
  studentId: number;
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

    if (!input.studentId || isNaN(Number(input.studentId))) {
      return createErrorResponse(
        "Selecione um aluno válido.",
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

    const student = await prisma.students.findFirst({
      where: { id: input.studentId, school_id: schoolId, status: 1 },
      select: { id: true },
    });
    if (!student) {
      return createErrorResponse(
        "Aluno inválido para a escola selecionada.",
        "VALIDATION_ERROR",
        400
      );
    }

    // Idempotência básica por payload: se já existir um agendamento idêntico ativo, retorna o existente
    const existingSame = await prisma.schedules.findFirst({
      where: {
        school_id: schoolId,
        student_id: input.studentId,
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
        student_id: true,
        students: { select: { id: true, name: true, status: true } },
      },
    });
    if (existingSame) {
      return createSuccessResponse(existingSame, "Aula criada com sucesso.");
    }

    const created = await prisma.schedules.create({
      data: {
        school_id: schoolId,
        student_id: input.studentId,
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
        student_id: true,
        students: {
          select: { id: true, name: true, status: true },
        },
      },
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

    const updated = await prisma.schedules.update({
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
        student_id: true,
        students: {
          select: { id: true, name: true, status: true },
        },
      },
    });

    return createSuccessResponse(updated, "Aula atualizada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
