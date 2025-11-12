"use client";

import type { IPublicActivity } from "../_models";
import { DiscoverCell } from "./Cell";

export function DiscoverList({
  activities,
}: {
  activities: IPublicActivity[];
}) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="col-span-12 sm:col-span-6 lg:col-span-4"
        >
          <DiscoverCell activity={activity} />
        </div>
      ))}
    </div>
  );
}
