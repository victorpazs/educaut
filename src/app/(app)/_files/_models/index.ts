import { Prisma } from "@/generated/prisma";

export type ISchoolFile = Prisma.filesGetPayload<{
  select: {
    id: true;
    type: true;
    size: true;
    url: true;
    status: true;
    created_at: true;
  };
}>;
