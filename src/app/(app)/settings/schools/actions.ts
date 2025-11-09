"use server";

import { prisma } from "@/lib/prisma";
import {
  createErrorResponse,
  createNotFoundError,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";
import { getCurrentUser } from "@/lib/session";
import type { ISchool } from "./_models";

interface GetSchoolsParams {
  search?: string;
}

export async function getSchools({ search }: GetSchoolsParams = {}): Promise<
  ApiResponse<ISchool[] | null>
> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return createErrorResponse(
        "Usuário não autenticado.",
        "AUTH_REQUIRED",
        401
      );
    }

    const normalizedSearch = search?.trim();

    const schools = await prisma.schools.findMany({
      where: {
        status: {
          not: 3,
        },
        school_users: {
          some: {
            user_id: user.id,
          },
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
        created_at: true,
        status: true,
      },
    });

    return createSuccessResponse(schools, "Escolas carregadas com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}

interface CreateSchoolParams {
  name: string;
}

export async function createSchool({
  name,
}: CreateSchoolParams): Promise<ApiResponse<ISchool | null>> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return createErrorResponse(
        "Usuário não autenticado.",
        "AUTH_REQUIRED",
        401
      );
    }

    const normalizedName = name?.trim();
    if (!normalizedName) {
      return createErrorResponse(
        "O nome da escola é obrigatório.",
        "VALIDATION_ERROR",
        400
      );
    }

    const school = await prisma.schools.create({
      data: {
        name: normalizedName,
        created_by: user.id,
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        status: true,
      },
    });

    return createSuccessResponse(school, "Escola criada com sucesso.", 201);
  } catch (error) {
    return handleServerError(error);
  }
}

interface UpdateSchoolParams {
  id: number;
  name: string;
}

export async function updateSchool({
  id,
  name,
}: UpdateSchoolParams): Promise<ApiResponse<ISchool | null>> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return createErrorResponse(
        "Usuário não autenticado.",
        "AUTH_REQUIRED",
        401
      );
    }

    if (!id || isNaN(Number(id))) {
      return createErrorResponse(
        "ID da escola inválido.",
        "INVALID_SCHOOL_ID",
        400
      );
    }

    const normalizedName = name?.trim();
    if (!normalizedName) {
      return createErrorResponse(
        "O nome da escola é obrigatório.",
        "VALIDATION_ERROR",
        400
      );
    }

    const schoolExists = await prisma.schools.findFirst({
      where: {
        id: Number(id),
        status: {
          not: 3,
        },
        school_users: {
          some: {
            user_id: user.id,
          },
        },
      },
      select: { id: true },
    });

    if (!schoolExists) {
      return createNotFoundError(
        "Escola não encontrada ou sem permissão de acesso."
      );
    }

    const updated = await prisma.schools.update({
      where: { id: Number(id) },
      data: { name: normalizedName },
      select: {
        id: true,
        name: true,
        created_at: true,
        status: true,
      },
    });

    return createSuccessResponse(updated, "Escola atualizada com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}

export async function deleteSchool(
  id: number
): Promise<ApiResponse<{ id: number } | null>> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return createErrorResponse(
        "Usuário não autenticado.",
        "AUTH_REQUIRED",
        401
      );
    }

    if (!id || isNaN(Number(id))) {
      return createErrorResponse(
        "ID da escola inválido.",
        "INVALID_SCHOOL_ID",
        400
      );
    }

    const schoolExists = await prisma.schools.findFirst({
      where: {
        id: Number(id),
        status: {
          not: 3,
        },
        school_users: {
          some: {
            user_id: user.id,
          },
        },
      },
      select: { id: true },
    });

    if (!schoolExists) {
      return createNotFoundError(
        "Escola não encontrada ou sem permissão de acesso."
      );
    }

    await prisma.schools.update({
      where: { id: Number(id) },
      data: { status: 3 },
    });

    return createSuccessResponse({ id: Number(id) }, "Escola removida.");
  } catch (error) {
    return handleServerError(error);
  }
}
