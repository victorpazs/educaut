import { Prisma } from "@/generated/prisma";

export type IPublicActivity = Prisma.activitiesGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    created_at: true;
    status: true;
    is_public: true;
  };
}>;


