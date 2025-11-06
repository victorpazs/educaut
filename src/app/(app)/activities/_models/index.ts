import { Prisma } from "@/generated/prisma";

export type IActivity = Prisma.activitiesGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    created_at: true;
    status: true;
  };
}>;
