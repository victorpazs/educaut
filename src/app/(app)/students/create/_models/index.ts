export interface StudentFormData {
  name: string;
  birthday: Date;
  school_year: string;
  school_segment: string;
  tea_support_level: string | null;
  non_verbal: boolean | null;
  description: string;
  student_attributes: number[];
}

export enum StudentCreateSteps {
  BASIC_INFO = "basic-info",
  DISORDER = "disorder",
  HYPERFOCUS = "hyperfocus",
  DIFFICULTY = "difficulty",
  PREFERENCE = "preference",
  POTENTIAL = "potential",
}

export type CheckboxField = {
  [Key in keyof StudentFormData]: StudentFormData[Key] extends string[]
    ? Key
    : never;
}[keyof StudentFormData];
