import { Prisma } from "@/generated/prisma";

export type Attribute = Prisma.attributesGetPayload<{
  select: {
    id: true;
    name: true;
    type_id: true;
  };
}>;

export type AttributesByType = Record<number, Attribute[]>;
