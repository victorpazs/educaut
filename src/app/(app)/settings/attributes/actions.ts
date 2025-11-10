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
        "Atributos da escola carregados com sucesso."
      );
    } catch (error) {
      return handleServerError(error);
    }
  }
);
