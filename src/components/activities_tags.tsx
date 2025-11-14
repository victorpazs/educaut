"use client";

import { useActivityTags } from "@/hooks/useActivityTags";
import { Chip } from "./ui/chip";
import { IActivityTag } from "@/app/(app)/_activity_tags/_models";

export function ActivitiesTags({
  selectedTags,
  onToggleTag,
  parentTags = [],
}: {
  selectedTags: string[];
  onToggleTag?: (tag: string) => void;
  parentTags?: IActivityTag[];
}) {
  const { tags, getIconByTag } = useActivityTags();

  const tagsToRender = parentTags.length > 0 ? parentTags : tags;

  return (
    <div className="flex flex-wrap gap-2">
      {tagsToRender.map((t) => {
        const selected = selectedTags.includes(t.tag);
        const Icon = getIconByTag(t.tag);
        return (
          <Chip
            key={t.tag}
            label={t.label}
            startIcon={Icon}
            onClick={() => {
              onToggleTag?.(t.tag) ?? undefined;
            }}
            variant={selected ? "standard" : "outlined"}
            color={selected ? "primary" : "default"}
            size="sm"
          />
        );
      })}
    </div>
  );
}
