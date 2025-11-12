"use client";

import { useEffect, useState } from "react";

import { formatDateTimeLocal } from "@/lib/utils";
import { getScheduleById } from "../actions";

export type EditScheduleData = {
  title: string;
  description: string;
  startInput: string;
  endInput: string;
};

export function useEditSchedule(params: {
  open: boolean;
  scheduleId?: number | null;
}) {
  const { open, scheduleId } = params;
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<EditScheduleData>(() => {
    const now = new Date();
    const nowStr = formatDateTimeLocal(now);
    return {
      title: "",
      description: "",
      startInput: nowStr,
      endInput: nowStr,
    };
  });

  useEffect(() => {
    let isActive = true;
    if (!open || !scheduleId) return;

    const run = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const result = await getScheduleById(scheduleId);
        if (!isActive) return;
        if (result.success && result.data) {
          const start =
            result.data.start_time instanceof Date
              ? result.data.start_time
              : new Date(result.data.start_time);
          const end =
            result.data.end_time instanceof Date
              ? result.data.end_time
              : new Date(result.data.end_time);
          setScheduleData({
            title: result.data.title ?? "",
            description: result.data.description ?? "",
            startInput: formatDateTimeLocal(start),
            endInput: formatDateTimeLocal(end),
          });
          setStudentName(result.data.students?.name ?? null);
        } else {
          setLoadError(result.message || "Falha ao carregar agendamento");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };
    run();

    return () => {
      isActive = false;
    };
  }, [open, scheduleId]);

  return {
    scheduleData,
    setScheduleData,
    loading,
    loadError,
    studentName,
  };
}
