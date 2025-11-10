"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chip } from "@/components/ui/chip";
import { getAttributeIcon, getAttributeLabel } from "@/lib/attributes.utils";
import type { AttributesData } from "@/app/(app)/_attributes/_models";

interface AttributesTabsProps {
  data: AttributesData;
}

export function AttributesTabs({ data }: AttributesTabsProps) {
  const defaultTab = data.attributeTypes[0];

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList>
        {data.attributeTypes.map((typeName) => {
          const Icon = getAttributeIcon(typeName);
          const label = getAttributeLabel(typeName);
          return (
            <TabsTrigger key={typeName} value={typeName} className="gap-2">
              {Icon && <Icon className="size-4" />}
              <span>{label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {data.attributeTypes.map((typeName) => (
        <TabsContent key={typeName} value={typeName} className="mt-4">
          <div className="grid grid-cols-12 gap-3">
            {(data.attributesByType[typeName] ?? []).map((attribute) => (
              <div
                key={attribute.id}
                className="col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <Chip
                  label={attribute.label}
                  variant="outlined"
                  className="w-full justify-start"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
