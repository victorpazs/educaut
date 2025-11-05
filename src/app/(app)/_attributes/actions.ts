"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { AttributesByType, AttributesData } from "./_models";

export const getAttributesByType = cache(
  async (): Promise<ApiResponse<AttributesData | null>> => {
    try {
      const attributeTypes = await prisma.attribute_types.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          attributes: {
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
        "Atributos carregados com sucesso."
      );
    } catch (error) {
      return handleServerError(error);
    }
  }
);
