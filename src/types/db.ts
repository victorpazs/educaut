import { Prisma } from "@/generated/prisma";

export type User = Prisma.usersGetPayload<{
  omit: {
    password_hash: true;
  };
}>;

export type ISchool = Prisma.schoolsGetPayload<{
  select: {
    id: true;
    name: true;
    created_at: true;
    status: true;
  };
}>;
