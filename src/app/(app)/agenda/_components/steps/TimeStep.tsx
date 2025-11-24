"use client";

import { DateTimePicker } from "@/components/ui/date-time-picker";
import { formatDateTimeLocal } from "@/lib/utils";
import { ScheduleFormData } from "../../create/_models";

interface TimeStepProps {
  formData: ScheduleFormData;

  onDateChange?: (field: keyof ScheduleFormData, value: Date) => void;
}

export function TimeStep({ formData, onDateChange }: TimeStepProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <DateTimePicker
          id="start"
          label="Data de início *"
          value={formData.start ? formatDateTimeLocal(formData.start) : ""}
          rangePeer={formData.end ? formatDateTimeLocal(formData.end) : ""}
          onChange={(newVal) => {
            const date = new Date(newVal);
            if (!isNaN(date.getTime())) {
              onDateChange?.("start", date);
            }
          }}
        />
      </div>

      <div className="col-span-12">
        <DateTimePicker
          id="end"
          label="Data de fim *"
          value={formData.end ? formatDateTimeLocal(formData.end) : ""}
          rangePeer={formData.start ? formatDateTimeLocal(formData.start) : ""}
          onChange={(newVal) => {
            const date = new Date(newVal);
            if (!isNaN(date.getTime())) {
              onDateChange?.("end", date);
            }
          }}
        />
      </div>
    </div>
  );
}
