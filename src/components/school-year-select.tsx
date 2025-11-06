"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getGroupedSchoolYears,
  getSchoolSegmentByYear,
} from "@/lib/school_year.utils";

type SchoolYearSelectProps = {
  value?: string;
  placeholder?: string;
  onYearAndSegmentChange: (yearValue: string, segment: string) => void;
  className?: string;
};

export function SchoolYearSelect({
  value,
  placeholder = "Selecione o ano escolar",
  onYearAndSegmentChange,
  className,
}: SchoolYearSelectProps) {
  const groups = getGroupedSchoolYears();

  const handleChange = (newValue: string) => {
    const segment = getSchoolSegmentByYear(Number(newValue));
    onYearAndSegmentChange(newValue, segment);
  };

  return (
    <Select value={value || ""} onValueChange={handleChange}>
      <SelectTrigger className={className || "w-full"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.options.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
