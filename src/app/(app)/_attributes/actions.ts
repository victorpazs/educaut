"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  createErrorResponse,
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { AttributesByType, AttributesData } from "./_models";
import { getAuthContext } from "@/lib/session";

export const getAttributesByType = cache(
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
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,

          attributes: {
            where: {
              OR: [{ school_id: schoolId }, { school_id: 0 }],
            },
            orderBy: {
              name: "asc",
            },
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const groupedAttributes = attributeTypes.reduce<AttributesByType>(
        (accumulator, type) => {
          accumulator[type.name] = type.attributes.map((attribute) => ({
            label: attribute.name,
            id: attribute.id,
          }));
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
        "Atributos de alunos carregados com sucesso."
      );
    } catch (error) {
      return handleServerError(error);
    }
  }
);
