import { Checkbox } from "@/components/ui/checkbox";
import { StudentFormData } from "../../create/_models";
import { AttributeOption } from "@/app/(app)/_attributes/_models";

interface AttributesStepProps {
  formData: StudentFormData;
  attributeFields: AttributeOption[];
  onAttributeChange: (attribute_id: number, value: boolean) => void;
}

export function AttributesStep({
  formData,
  attributeFields,
  onAttributeChange,
}: AttributesStepProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {attributeFields.map((attribute) => (
        <div
          key={attribute.id}
          className="col-span-12 md:col-span-6 lg:col-span-4 flex items-center space-x-2"
        >
          <Checkbox
            id={attribute.id.toString()}
            checked={formData.student_attributes?.some(
              (id) => id === attribute.id
            )}
            onCheckedChange={(checked) =>
              onAttributeChange(attribute.id, checked)
            }
          />
          <label
            htmlFor={attribute.id.toString()}
            className="text-sm font-medium"
          >
            {attribute.label}
          </label>
        </div>
      ))}
    </div>
  );
}
