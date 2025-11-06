"use server";

import { prisma } from "@/lib/prisma";
import {
  createSuccessResponse,
  createErrorResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { IActivity } from "./_models";

interface GetActivitiesParams {
  search?: string;
}

export async function getActivities({
  search,
}: GetActivitiesParams): Promise<ApiResponse<IActivity[] | null>> {
  try {
    const normalizedSearch = search?.trim();

    const activities = await prisma.activities.findMany({
      where: {
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
        description: true,
        created_at: true,
        status: true,
      },
    });

    return createSuccessResponse(
      activities,
      "Atividades carregadas com sucesso."
    );
  } catch (error) {
    return handleServerError(error);
  }
}
