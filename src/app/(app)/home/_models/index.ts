export interface IInsights {
  totalStudents: number;
  totalActivities: number;
  weeklyClasses: number;
}

export interface ICurrentClass {
  id: number;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  students: {
    id: number;
    name: string;
  }[];
}
