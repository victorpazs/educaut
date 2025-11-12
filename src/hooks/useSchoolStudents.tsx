import { useMemo } from "react";
import { useStudentsContext } from "@/providers/students";
import type { StudentOption } from "@/providers/students";

type UseSchoolStudentsResult = {
  studentsOptions: StudentOption[];
};

export function useSchoolStudents(): UseSchoolStudentsResult {
  const { options } = useStudentsContext();

  const studentsOptions = useMemo(() => options, [options]);

  return { studentsOptions };
}


