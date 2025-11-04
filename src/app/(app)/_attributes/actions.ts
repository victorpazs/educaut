"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  createSuccessResponse,
  handleServerError,
  type ApiResponse,
} from "@/lib/server-responses";

import type { AttributesByType } from "./_models";

export const getAttributesByType = cache(
  async (): Promise<ApiResponse<AttributesByType | null>> => {
    try {
      const attributeTypes = await prisma.attribute_types.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          attributes: {
            orderBy: {
              name: "asc",
            },
            select: {
              id: true,
              name: true,
              type_id: true,
            },
          },
        },
      });

      const groupedAttributes = attributeTypes.reduce<AttributesByType>(
        (accumulator, type) => {
          accumulator[type.id] = type.attributes;
          return accumulator;
        },
        {}
      );

      return createSuccessResponse(
        groupedAttributes,
        "Atributos carregados com sucesso."
      );
    } catch (error) {
      return handleServerError(error);
    }
  }
);
