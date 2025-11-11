import type { AttributeOption } from "@/app/(app)/_attributes/_models";
import { TableCell, TableRow } from "@/components/ui/table";

export function AttributeCell({ option }: { option: AttributeOption }) {
  return (
    <TableRow key={option.id}>
      <TableCell>{option.label}</TableCell>
    </TableRow>
  );
}
