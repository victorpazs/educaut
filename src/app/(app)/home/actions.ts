"use server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { IInsights, ICurrentClass } from "./_models";

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

export async function getCurrentClass(): Promise<
  ApiResponse<ICurrentClass | null>
> {
  try {
    const { school } = await getAuthContext();
    const schoolId = school?.id;

    if (!schoolId) {
      return createErrorResponse(
        "No school selected.",
        "SCHOOL_NOT_SELECTED",
        400
      );
    }

    const now = new Date();

    const currentSchedule = await prisma.schedules.findFirst({
      where: {
        school_id: schoolId,
        status: 1,
        start_time: {
          lte: now,
        },
        end_time: {
          gte: now,
        },
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
        schedules_students: {
          select: {
            students: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        start_time: "asc",
      },
    });

    if (!currentSchedule) {
      return createSuccessResponse(null, "No ongoing class found.");
    }

    const students = currentSchedule.schedules_students.map(
      (ss) => ss.students
    );

    return createSuccessResponse(
      {
        id: currentSchedule.id,
        title: currentSchedule.title ?? "Untitled class",
        description: currentSchedule.description,
        startTime: currentSchedule.start_time,
        endTime: currentSchedule.end_time,
        students,
      },
      "Current class found."
    );
  } catch (error) {
    return handleServerError(error);
  }
}
