"use client";

import { Combobox } from "@/components/ui/combobox";
import { useSchoolStudents } from "@/hooks/useSchoolStudents";

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

	return (
		<Combobox
			options={options}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			searchPlaceholder={searchPlaceholder}
			emptyText={emptyText}
			buttonClassName={buttonClassName}
			className={className}
		/>
	);
}


