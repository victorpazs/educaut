"use client";

import * as React from "react";
import { Combobox } from "@/components/ui/combobox";
import { ScheduleFormData } from "../../create/_models";
import { useActivities } from "@/app/(app)/activities/_hooks/use-activities";
import { X } from "lucide-react";
import { Chip } from "@/components/ui/chip";

interface ActivitiesStepProps {
  formData: ScheduleFormData;
  onActivityChange: (activityId: number, value: boolean) => void;
}

export function ActivitiesStep({
  formData,
  onActivityChange,
}: ActivitiesStepProps) {
  const { activities } = useActivities({ search: "", tags: [] });

  const options = React.useMemo(
    () =>
      activities.map((activity) => ({
        value: activity.id,
        label: activity.name,
      })),
    [activities]
  );

  const handleAdd = (option: { value: number; label: string }) => {
    const alreadySelected =
      formData.activityIds?.includes(option.value) ?? false;
    if (!alreadySelected) {
      onActivityChange(option.value, true);
    }
  };

  const handleRemove = (option: { value: number; label: string }) => {
    const alreadySelected =
      formData.activityIds?.includes(option.value) ?? false;
    if (alreadySelected) {
      onActivityChange(option.value, false);
    }
  };

  return (
    <div className="space-y-4">
      <Combobox
        options={options}
        mode="additive"
        onAdd={handleAdd}
        onRemove={handleRemove}
        selectedValues={formData.activityIds ?? []}
        placeholder="Selecione uma ou mais atividades..."
        buttonClassName="w-full font-normal! justify-between!"
        className="w-full! min-w-[320px]"
      />
      <div className="flex flex-wrap items-start flex-col gap-2">
        {(formData.activityIds ?? []).map((id) => {
          const activity = activities.find((a) => a.id === id);
          if (!activity) return null;
          return (
            <Chip
              key={id}
              label={activity.name}
              variant={"outlined"}
              size="sm"
              className="text-sm justify-start! text-muted-foreground"
              endIcon={
                <X
                  className="text-secondary cursor-pointer size-3 ml-auto"
                  onClick={() =>
                    handleRemove({ value: id, label: activity.name })
                  }
                />
              }
            />
          );
        })}
      </div>
    </div>
  );
}
