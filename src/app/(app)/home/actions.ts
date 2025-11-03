"use server";

import { prisma } from "@/lib/prisma";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { IInsights } from "./_models";

interface GetInsightsParams {
  schoolId?: number | null;
}

function getCurrentWeekBoundaries() {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  return { startOfWeek, endOfWeek };
}

export async function getInsights({
  schoolId,
}: GetInsightsParams): Promise<ApiResponse<IInsights | null>> {
  try {
    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400
      );
    }

    const { startOfWeek, endOfWeek } = getCurrentWeekBoundaries();

    const [totalStudents, weeklyClassesResult] = await Promise.all([
      prisma.students.count({
        where: {
          school_id: schoolId,
          status: {
            not: 3,
          },
        },
      }),
      prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count
        FROM schedules
        WHERE school_id = ${schoolId}
          AND status = 1
          AND created_at >= ${startOfWeek}
          AND created_at < ${endOfWeek}
      `,
    ]);

    const weeklyClasses = Number(weeklyClassesResult?.[0]?.count ?? 0);

    const insights: IInsights = {
      totalStudents,
      totalActivities: 0,
      weeklyClasses,
    };

    return createSuccessResponse(insights, "Insights carregados com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
