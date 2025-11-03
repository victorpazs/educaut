"use server";

import { prisma } from "@/lib/prisma";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

export type LiveSearchResult = {
  id: string;
  name: string;
  type: string;
};

type LiveSearchParams = {
  query: string;
  schoolId?: number | null;
};

const AGENDA_DAY_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "America/Sao_Paulo",
});

const AGENDA_TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export async function liveSearch(
  params: LiveSearchParams
): Promise<ApiResponse<LiveSearchResult[] | null>> {
  try {
    const { query, schoolId } = params;

    if (!schoolId) {
      return createErrorResponse(
        "Nenhuma escola selecionada.",
        "SCHOOL_NOT_SELECTED",
        400
      );
    }

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return createSuccessResponse([], "Nenhum termo de busca informado.");
    }

    const likePattern = `%${normalizedQuery}%`;

    const [students, agendas] = await Promise.all([
      prisma.students.findMany({
        where: {
          school_id: schoolId,
          status: 1,
          name: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
        take: 5,
      }),
      prisma.$queryRaw<
        { id: number; start_time: Date; student_name: string }[]
      >`
        SELECT s.id, s.start_time, st.name AS student_name
        FROM schedules s
        INNER JOIN students st ON st.id = s.student_id
        WHERE s.school_id = ${schoolId}
          AND s.status = 1
          AND st.status = 1
          AND to_char(s.start_time, 'DD/MM/YYYY HH24:MI') ILIKE ${likePattern}
        ORDER BY s.start_time ASC
        LIMIT 5
      `,
    ]);

    const results: LiveSearchResult[] = [];

    if (students.length) {
      results.push(
        ...students.map((student) => ({
          id: `student:${student.id}`,
          name: student.name,
          type: "student",
        }))
      );
    }

    if (agendas.length) {
      results.push(
        ...agendas.map((agenda) => {
          const scheduleDate =
            agenda.start_time instanceof Date
              ? agenda.start_time
              : new Date(agenda.start_time);

          const formattedDay = AGENDA_DAY_FORMATTER.format(scheduleDate);
          const formattedTime = AGENDA_TIME_FORMATTER.format(scheduleDate);

          return {
            id: `schedule:${agenda.id}`,
            name: `Aula com ${agenda.student_name} no dia ${formattedDay} às ${formattedTime}`,
            type: "calendar",
          };
        })
      );
    }

    return createSuccessResponse(results, "Resultados carregados com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
