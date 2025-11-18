import { Prisma } from "@/generated/prisma";

export type IPublicActivity = Prisma.activitiesGetPayload<{
  select: {
    id: true;
    name: true;
    content: true;
    description: true;
    created_at: true;
    status: true;
    tags: true;
    is_public: true;
  };
}>;
