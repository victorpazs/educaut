"use client";

import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useContext, useMemo } from "react";
import { useSession } from "@/hooks/useSession";
import { useSchoolChange } from "@/hooks/useSchoolChange";
import { ModalsContext } from "@/providers/modals";

export function SchoolsSelector() {
  const { user, school } = useSession();
  const { changeSchool, isPending } = useSchoolChange();
  const { openSchoolCreateDialog } = useContext(ModalsContext);

  const schools = useMemo(() => user?.schools ?? [], [user?.schools]);
  const selectedSchool = school ?? null;
  const isSelectDisabled = isPending;

  const handleSelectSchool = (schoolId: string) => {
    if (schoolId === "__new_school__") {
      openSchoolCreateDialog();
      return;
    }

    const nextSchool = schools.find((item) => item.id === Number(schoolId));
    if (!nextSchool) return;

    changeSchool(nextSchool);
  };

  return (
    <Select
      value={selectedSchool ? String(selectedSchool.id) : undefined}
      onValueChange={handleSelectSchool}
      disabled={isSelectDisabled}
    >
      <SelectTrigger
        className="w-full justify-between"
        disabled={isSelectDisabled}
      >
        <div className="flex items-center gap-3">
          <SelectValue placeholder="Selecione uma escola" />
        </div>
      </SelectTrigger>
      <SelectContent align="start" className="max-h-64">
        <SelectGroup>
          <SelectLabel className="text-xs text-secondary px-1.5 py-1.5">
            Escolas
          </SelectLabel>

          {schools.map((userSchool) => (
            <SelectItem
              key={userSchool.id}
              value={String(userSchool.id)}
              disabled={isPending && userSchool.id !== selectedSchool?.id}
            >
              {userSchool.name}
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem value="__new_school__">
            <PlusCircle className="text-black" />
            Nova escola
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
