import type { AttributesData } from "@/app/(app)/_attributes/_models";

export interface UseAttributesResult {
  data: AttributesData | null;
  isLoading: boolean;
  hasError: boolean;
  hasSchool: boolean;
  reFetch: () => Promise<void>;
}
