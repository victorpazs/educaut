"use client";

import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { IPublicActivity } from "../_models";
import { formatDate } from "@/lib/utils";

export function DiscoverCell({ activity }: { activity: IPublicActivity }) {
  return (
    <Card className="p-4 h-full flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-tight line-clamp-2">
          {activity.name}
        </h3>
      </div>
      {activity.description ? (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {activity.description}
        </p>
      ) : null}
      <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>{formatDate(activity.created_at ?? new Date())}</span>
      </div>
    </Card>
  );
}
