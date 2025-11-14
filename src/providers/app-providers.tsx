import { AttributesProvider } from "@/providers/attributes";
import { SearchProvider } from "@/providers/search";

import { ModalsProvider } from "@/providers/modals";
import { StudentsProvider } from "@/providers/students";
import { ActivityTagsProvider } from "@/providers/activity-tags";
import { getAttributesByType } from "@/app/(app)/_attributes/actions";
import { getSchoolStudentsOptions } from "@/app/(app)/_school_students/actions";
import { getActivityTags } from "@/app/(app)/_activity_tags/actions";

export async function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const attributesResponse = await getAttributesByType();
  const attributesData =
    attributesResponse.success && attributesResponse.data
      ? attributesResponse.data
      : { attributesByType: {}, attributeTypes: [] };
  const studentsResponse = await getSchoolStudentsOptions();
  const studentsOptions =
    studentsResponse.success && studentsResponse.data
      ? studentsResponse.data
      : [];
  const activityTagsResponse = await getActivityTags();
  const activityTags =
    activityTagsResponse.success && activityTagsResponse.data
      ? activityTagsResponse.data
      : [];
  return (
    <AttributesProvider value={attributesData}>
      <StudentsProvider value={studentsOptions}>
        <ActivityTagsProvider value={activityTags}>
          <ModalsProvider>
            <SearchProvider>{children}</SearchProvider>
          </ModalsProvider>
        </ActivityTagsProvider>
      </StudentsProvider>
    </AttributesProvider>
  );
}
