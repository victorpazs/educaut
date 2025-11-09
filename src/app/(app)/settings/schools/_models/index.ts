import { Prisma } from "@/generated/prisma";

export type ISchool = Prisma.schoolsGetPayload<{
  select: {
    id: true;
    name: true;
    created_at: true;
    status: true;
  };
}>;


