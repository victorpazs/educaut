export interface StudentFormData {
  name: string;
  age: string;
  segment: string;
  tea: string;
  otherDisorders: string[];
  communication: string;
  hyperfocus: string[];
  preferences: string[];
  difficulties: string[];
  observation: string;
}

export type CheckboxField = {
  [Key in keyof StudentFormData]: StudentFormData[Key] extends string[]
    ? Key
    : never;
}[keyof StudentFormData];
