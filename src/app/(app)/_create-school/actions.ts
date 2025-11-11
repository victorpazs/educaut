"use server";

import { prisma } from "@/lib/prisma";
import {
  ApiResponse,
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
} from "@/lib/server-responses";
import { getCurrentUser } from "@/lib/session";
import type { ISchool } from "@/types/db";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/settings/schools");
    return createSuccessResponse(school, "Escola criada com sucesso.", 201);
  } catch (error) {
    return handleServerError(error);
  }
}
