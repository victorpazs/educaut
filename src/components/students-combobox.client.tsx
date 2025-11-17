"use client";

import { Combobox } from "@/components/ui/combobox";
import { useSchoolStudents } from "@/hooks/useSchoolStudents";
import { cn } from "@/lib/utils";
import { CommandItem } from "./ui/command";
import { ExternalLink, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  buttonClassName?: string;
  className?: string;
};

export function StudentComboboxClient({
  value,
  onChange,
  placeholder = "Selecione o estudante...",
  searchPlaceholder = "Buscar estudante...",
  emptyText = "Nenhum estudante encontrado",
  buttonClassName,
  className,
}: Props) {
  const { studentsOptions: options } = useSchoolStudents();
  const router = useRouter();
  return (
    <Combobox
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      buttonClassName={cn(
        "flex justify-between! font-normal! ",
        buttonClassName
      )}
      className={className}
      renderEmpty={(query) => (
        <Button
          size="sm"
          className="w-full px-2! font-normal! justify-between! "
          variant="ghost"
          onClick={() => {
            router.push("/students/create");
          }}
        >
          Criar aluno &quot;{query}&quot;
          <ExternalLink className="h-4 w-4" />{" "}
        </Button>
      )}
    />
  );
}
