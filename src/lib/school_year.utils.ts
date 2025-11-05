import { schoolSegments } from "./school_segment.utils";

export const schoolYears = [
  {
    label: "Educação Infantil - Pré I",
    value: 0,
  },
  {
    label: "Educação Infantil - Pré II",
    value: 1,
  },
  {
    label: "1º Ano do Ensino Fundamental",
    value: 2,
  },
  {
    label: "2º Ano do Ensino Fundamental",
    value: 3,
  },
  {
    label: "3º Ano do Ensino Fundamental",
    value: 4,
  },
  {
    label: "4º Ano do Ensino Fundamental",
    value: 5,
  },
  {
    label: "5º Ano do Ensino Fundamental",
    value: 6,
  },
  {
    label: "6º Ano do Ensino Fundamental",
    value: 7,
  },
  {
    label: "7º Ano do Ensino Fundamental",
    value: 8,
  },
  {
    label: "8º Ano do Ensino Fundamental",
    value: 9,
  },
  {
    label: "9º Ano do Ensino Fundamental",
    value: 10,
  },
  {
    label: "1º Ano do Ensino Médio",
    value: 11,
  },
  {
    label: "2º Ano do Ensino Médio",
    value: 12,
  },
  {
    label: "3º Ano do Ensino Médio",
    value: 13,
  },
];

export function getSchoolSegmentByYear(yearValue: number): string {
  if (yearValue === 0 || yearValue === 1) return schoolSegments[0];
  if (yearValue >= 2 && yearValue <= 6) return schoolSegments[1];
  if (yearValue >= 7 && yearValue <= 10) return schoolSegments[2];
  return schoolSegments[3];
}

type GroupedYears = {
  label: string;
  options: { label: string; value: number }[];
};

export function getGroupedSchoolYears(): GroupedYears[] {
  const groups: { label: string; range: number[] }[] = [
    { label: schoolSegments[0], range: [0, 1] },
    { label: schoolSegments[1], range: [2, 3, 4, 5, 6] },
    { label: schoolSegments[2], range: [7, 8, 9, 10] },
    { label: schoolSegments[3], range: [11, 12, 13] },
  ];

  return groups.map((g) => ({
    label: g.label,
    options: schoolYears.filter((y) => g.range.includes(y.value)),
  }));
}
