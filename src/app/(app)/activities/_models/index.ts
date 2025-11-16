import { Prisma } from "@/generated/prisma";

export type IActivity = Prisma.activitiesGetPayload<{
  select: {
    id: true;
    name: true;
    content: true;
    description: true;
    created_at: true;
    status: true;
    tags: true;
  };
}>;

export interface IActivityContent {
  type: string;
  data: {
    version: string;
    objects: unknown[];
    background: string;
  };
}
export type ICreateActivity = {
  name: string;
  description: string;
  content: IActivityContent;
};

export type IUpdateActivity = Omit<IActivity, "content"> & {
  content: IActivityContent;
};
