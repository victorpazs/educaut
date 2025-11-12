"use server";

import { prisma } from "@/lib/prisma";
import {
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { IPublicActivity } from "./_models";

interface GetPublicActivitiesParams {
  search?: string;
}

export async function getPublicActivities({
  search,
}: GetPublicActivitiesParams): Promise<ApiResponse<IPublicActivity[] | null>> {
  try {
    const normalizedSearch = search?.trim();

    const activities = await prisma.activities.findMany({
      where: {
        status: {
          not: 3,
        },
        is_public: true,
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
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        status: true,
        is_public: true,
      },
    });

    return createSuccessResponse(
      activities,
      "Atividades públicas carregadas com sucesso."
    );
  } catch (error) {
    return handleServerError(error);
  }
}
