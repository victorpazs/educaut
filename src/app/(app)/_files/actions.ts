"use server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/session";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { ISchoolFile } from "./_models";

export async function getSchoolFiles(): Promise<
  ApiResponse<ISchoolFile[] | null>
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

    const files = await prisma.files.findMany({
      where: {
        school_id: schoolId,
        status: 1,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        type: true,
        size: true,
        url: true,
        status: true,
        created_at: true,
      },
    });

    return createSuccessResponse(files, "Arquivos carregados com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
