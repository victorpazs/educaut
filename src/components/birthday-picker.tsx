"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type BirthdayPickerProps = {
  id?: string;
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  className?: string;
  buttonClassName?: string;
};

export function BirthdayPicker({
  id = "birthday",
  label = "Data de Nascimento",
  value,
  onChange,
  className,
  buttonClassName,
}: BirthdayPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={className}>
      <Label htmlFor={id} className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            id={id}
            className={
              buttonClassName ||
              "text-start flex w-full justify-between font-normal! h-9"
            }
          >
            {value ? value.toLocaleDateString() : "Selecionar data"}
            <CalendarIcon className="ml-auto size-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                onChange(date);
              }
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
