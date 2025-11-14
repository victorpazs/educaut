"use server";

import { prisma } from "@/lib/prisma";
import {
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";
import { IActivityTag } from "./_models";

export async function getActivityTags(): Promise<
  ApiResponse<IActivityTag[] | null>
> {
  try {
    const rows = await prisma.$queryRaw<
      IActivityTag[]
    >`SELECT label, tag FROM activity_tags ORDER BY label ASC`;

    return createSuccessResponse(rows, "Tags carregadas com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}
