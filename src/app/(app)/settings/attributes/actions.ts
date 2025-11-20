"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";
import { getAuthContext } from "@/lib/session";
import { revalidatePath } from "next/cache";

import type {
  AttributesByType,
  AttributesData,
} from "@/app/(app)/_attributes/_models";

export const getSchoolAttributesByType = cache(
  async (): Promise<ApiResponse<AttributesData | null>> => {
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

      const attributeTypes = await prisma.attribute_types.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          attributes: {
            where: { school_id: schoolId },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
          },
        },
      });

      const groupedAttributes = attributeTypes.reduce<AttributesByType>(
        (accumulator, type) => {
          if (type.attributes.length > 0) {
            accumulator[type.name] = type.attributes.map((attribute) => ({
              label: attribute.name,
              id: attribute.id,
            }));
          }
          return accumulator;
        },
        {}
      );

      const normalizedAttributeTypes: string[] = Object.keys(groupedAttributes);

      return createSuccessResponse(
        {
          attributesByType: groupedAttributes,
          attributeTypes: normalizedAttributeTypes,
        },
        "Atributos de alunos da escola carregados com sucesso."
      );
    } catch (error) {
      return handleServerError(error);
    }
  }
);

export type CreateAttributeInput =
  | { name: string; type_id: number }
  | { name: string; typeName: string };

export async function createAttribute(
  data: CreateAttributeInput
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

    const normalizedName = data.name?.trim();
    if (!normalizedName) {
      return createErrorResponse(
        "O nome do atributo é obrigatório.",
        "VALIDATION_ERROR",
        400
      );
    }

    // Resolve type_id from either direct id or provided typeName
    let resolvedTypeId: number | null = null;
    if ("type_id" in data && data.type_id) {
      resolvedTypeId = Number(data.type_id);
    } else if ("typeName" in data && data.typeName) {
      const type = await prisma.attribute_types.findUnique({
        where: { name: data.typeName },
        select: { id: true },
      });
      resolvedTypeId = type?.id ?? null;
    }

    if (!resolvedTypeId)
      return createErrorResponse(
        "O tipo do atributo é obrigatório.",
        "VALIDATION_ERROR",
        400
      );

    const created = await prisma.attributes.create({
      data: {
        type_id: resolvedTypeId,
        name: normalizedName,
        school_id: schoolId,
      },
      select: { id: true },
    });

    revalidatePath("/settings/attributes");
    return createSuccessResponse(created, "Atributo criado com sucesso.");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return createErrorResponse(
        "Já existe um atributo com esse nome para este tipo.",
        "DUPLICATE_ATTRIBUTE",
        409
      );
    }
    return handleServerError(error);
  }
}

export async function deleteAttribute(id: number): Promise<ApiResponse<null>> {
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

    const deleteResult = await prisma.attributes.deleteMany({
      where: { id, school_id: schoolId },
    });

    if (deleteResult.count === 0) {
      return createErrorResponse(
        "Atributo não encontrado.",
        "ATTRIBUTE_NOT_FOUND",
        404
      );
    }

    revalidatePath("/settings/attributes");
    return createSuccessResponse(null, "Atributo removido com sucesso.");
  } catch (error) {
    return handleServerError(error);
  }
}

export async function updateAttributeName(
  id: number,
  name: string
): Promise<ApiResponse<null>> {
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

    const normalizedName = name?.trim();
    if (!normalizedName) {
      return createErrorResponse(
        "O nome do atributo é obrigatório.",
        "VALIDATION_ERROR",
        400
      );
    }

    // Ensure attribute belongs to the current school
    const existing = await prisma.attributes.findFirst({
      where: { id, school_id: schoolId },
      select: { id: true, type_id: true },
    });
    if (!existing) {
      return createErrorResponse(
        "Atributo não encontrado.",
        "ATTRIBUTE_NOT_FOUND",
        404
      );
    }

    await prisma.attributes.update({
      where: { id },
      data: { name: normalizedName },
    });

    revalidatePath("/settings/attributes");
    return createSuccessResponse(null, "Atributo atualizado com sucesso.");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return createErrorResponse(
        "Já existe um atributo com esse nome para este tipo.",
        "DUPLICATE_ATTRIBUTE",
        409
      );
    }
    return handleServerError(error);
  }
}
