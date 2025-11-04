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
