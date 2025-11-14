"use server";

import { prisma } from "@/lib/prisma";
import {
  createSuccessResponse,
  createErrorResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";
import { getAuthContext } from "@/lib/session";

import type { IActivity } from "./_models";

export interface GetActivitiesParams {
  search?: string;
  tags?: string[];
}

export async function getActivities({
  search,
  tags,
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
        ...(tags && tags.length > 0
          ? {
              tags: {
                hasSome: tags,
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
        content: true,
        created_at: true,
        status: true,
        tags: true,
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

export type CreateActivityInput = {
  name: string;
  description?: string | null;
  tags: string[];
};

export async function createActivityAction(
  input: CreateActivityInput
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

    if (!input.name?.trim()) {
      return createErrorResponse(
        "Nome da atividade é obrigatório.",
        "VALIDATION_ERROR",
        400
      );
    }

    const created = await prisma.activities.create({
      data: {
        school_id: schoolId,
        name: input.name.trim(),
        description: input.description?.trim() || undefined,
        content: {
          type: "canvas",
          data: {
            version: "6.9.0",
            objects: [],
            background: "#ffffff",
          },
        },
        is_public: false,
        tags: Array.isArray(input.tags) ? input.tags : [],
      },
      select: { id: true },
    });

    if (!created) {
      return createErrorResponse(
        "Não foi possível criar a atividade.",
        "FAILED_TO_CREATE_ACTIVITY",
        500
      );
    }

    return createSuccessResponse(created, "Atividade criada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}

export async function getActivityById(
  id: number
): Promise<ApiResponse<IActivity | null>> {
  try {
    if (!id || Number.isNaN(Number(id))) {
      return createErrorResponse(
        "ID da atividade inválido.",
        "INVALID_ACTIVITY_ID",
        400
      );
    }

    const activity = await prisma.activities.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        created_at: true,
        status: true,
        tags: true,
      },
    });

    if (!activity) {
      return createErrorResponse(
        "Atividade não encontrada.",
        "ACTIVITY_NOT_FOUND",
        404
      );
    }

    return createSuccessResponse(activity, "Atividade carregada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}

export async function deleteActivity(id: number): Promise<ApiResponse<null>> {
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
        "ID da atividade inválida.",
        "INVALID_ACTIVITY_ID",
        400
      );
    }

    const existing = await prisma.activities.findFirst({
      where: { id: Number(id), school_id: schoolId, status: { not: 3 } },
      select: { id: true },
    });

    if (!existing) {
      return createErrorResponse(
        "Atividade não encontrada ou não pertence à escola selecionada.",
        "ACTIVITY_NOT_FOUND",
        404
      );
    }

    await prisma.activities.update({
      where: { id: Number(existing.id) },
      data: { status: 3 },
    });

    return createSuccessResponse(null, "Atividade removida com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
