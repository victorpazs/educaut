export type AttributeOption = { label: string; id: number };
export type AttributesByType = Record<string, AttributeOption[]>;

export interface AttributesData {
  attributesByType: AttributesByType;
  attributeTypes: string[];
}
