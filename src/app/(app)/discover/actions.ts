"use server";

import { prisma } from "@/lib/prisma";
import {
  createSuccessResponse,
  createErrorResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { IPublicActivity } from "./_models";
import { getAuthContext } from "@/lib/session";
import { Prisma } from "@/generated/prisma";

interface GetPublicActivitiesParams {
  search?: string;
  tags?: string[];
}

export async function getPublicActivities({
  search,
  tags,
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
        ...(tags && tags.length > 0
          ? {
              tags: {
                hasSome: tags,
              },
            }
          : {}),
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        content: true,
        tags: true,
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

export async function importPublicActivity(
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

    if (!id || Number.isNaN(Number(id))) {
      return createErrorResponse(
        "ID da atividade inválido.",
        "INVALID_ACTIVITY_ID",
        400
      );
    }

    const source = await prisma.activities.findFirst({
      where: {
        id: Number(id),
        is_public: true,
        status: { not: 3 },
      },
      select: {
        name: true,
        description: true,
        content: true,
        tags: true,
      },
    });

    if (!source) {
      return createErrorResponse(
        "Atividade pública não encontrada.",
        "PUBLIC_ACTIVITY_NOT_FOUND",
        404
      );
    }

    const created = await prisma.activities.create({
      data: {
        school_id: schoolId,
        name: source.name,
        description: source.description,
        content: source.content as Prisma.InputJsonValue,
        is_public: false,
        tags: Array.isArray(source.tags) ? source.tags : [],
      },
      select: { id: true },
    });

    return createSuccessResponse(created, "Atividade importada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
