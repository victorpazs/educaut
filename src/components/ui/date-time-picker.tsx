"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateTimePickerProps = {
  id?: string;
  label?: string; // Label for the date selector
  value?: string; // Must follow the same format as <input type="datetime-local" />
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  step?: number; // Seconds step for time input; defines HH:mm vs HH:mm:ss
};

export function DateTimePicker({
  id = "date-time-picker",
  label = "Date",
  value,
  onChange,
  className,
  buttonClassName,
  step = 60,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const includeSeconds = React.useMemo(() => step < 60, [step]);

  function pad2(n: number) {
    return String(n).padStart(2, "0");
  }

  function parseDatePartsFromValue(
    valueStr?: string
  ): { year: number; month: number; day: number } | null {
    if (!valueStr) return null;
    const [datePart] = valueStr.split("T");
    if (!datePart) return null;
    const [y, m, d] = datePart.split("-");
    const year = Number(y);
    const month = Number(m);
    const day = Number(d);
    if (
      !Number.isFinite(year) ||
      !Number.isFinite(month) ||
      !Number.isFinite(day)
    ) {
      return null;
    }
    return { year, month, day };
  }

  function parseTimePartFromValue(valueStr?: string): string | null {
    if (!valueStr) return null;
    const parts = valueStr.split("T");
    if (parts.length < 2) return null;
    const time = parts[1];
    // Accept HH:mm or HH:mm:ss; trim potential milliseconds or timezone (shouldn't exist in datetime-local)
    const [hh, mm, ss] = time.split(":");
    if (!hh || !mm) return null;
    if (includeSeconds) {
      return `${pad2(Number(hh))}:${pad2(Number(mm))}:${pad2(
        Number(ss ?? "0")
      )}`;
    }
    return `${pad2(Number(hh))}:${pad2(Number(mm))}`;
  }

  function buildLocalDateFromParts(parts: {
    year: number;
    month: number;
    day: number;
  }): Date {
    // month in Date() is 0-based
    return new Date(parts.year, parts.month - 1, parts.day);
  }

  function formatDatePart(parts: {
    year: number;
    month: number;
    day: number;
  }): string {
    return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
  }

  function combineToDateTimeLocal(
    dateParts: { year: number; month: number; day: number },
    timePart: string | null | undefined
  ): string {
    let finalTime = timePart;
    if (!finalTime) {
      finalTime = includeSeconds ? "00:00:00" : "00:00";
    } else {
      // Normalize time to expected precision
      const [hh, mm, ss] = finalTime.split(":");
      if (includeSeconds) {
        finalTime = `${pad2(Number(hh))}:${pad2(Number(mm))}:${pad2(
          Number(ss ?? "0")
        )}`;
      } else {
        finalTime = `${pad2(Number(hh))}:${pad2(Number(mm))}`;
      }
    }
    return `${formatDatePart(dateParts)}T${finalTime}`;
  }

  const dateParts = React.useMemo(
    () => parseDatePartsFromValue(value),
    [value]
  );
  const timePart = React.useMemo(
    () => parseTimePartFromValue(value),
    [value, includeSeconds]
  );
  const selectedDate = React.useMemo(
    () => (dateParts ? buildLocalDateFromParts(dateParts) : undefined),
    [dateParts]
  );
  const timeInputValue = timePart ?? "";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1 flex-1">
        <Label htmlFor={`${id}-date`} className="px-1">
          {label}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={`${id}-date`}
              className={`min-w-32 text-start! flex justify-between! w-full! font-normal!  ${
                buttonClassName ? ` ${buttonClassName}` : ""
              }`}
            >
              {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon className="h-4 w-4 text-secondary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              onSelect={(pickedDate) => {
                if (!pickedDate) return;
                const newDateParts = {
                  year: pickedDate.getFullYear(),
                  month: pickedDate.getMonth() + 1,
                  day: pickedDate.getDate(),
                };
                const newValue = combineToDateTimeLocal(newDateParts, timePart);
                onChange(newValue);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-1">
        <Input
          type="time"
          id={`${id}-time`}
          step={step}
          value={timeInputValue}
          onChange={(e) => {
            const nextTime = e.target.value; // HH:mm or HH:mm:ss based on step
            const baseDateParts =
              dateParts ??
              (() => {
                const today = new Date();
                return {
                  year: today.getFullYear(),
                  month: today.getMonth() + 1,
                  day: today.getDate(),
                };
              })();
            const newValue = combineToDateTimeLocal(baseDateParts, nextTime);
            onChange(newValue);
          }}
          className="mt-6 py-[19px]! bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
