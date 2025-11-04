"use client";

import { useEffect, useRef, useState } from "react";

import { useSession } from "@/hooks/useSession";
import { toast } from "@/lib/toast";

import type { IAgendaCalendarEvent, IAgendaSchedule } from "../_models";
import { getAgenda } from "../actions";

interface UseAgendaResult {
  events: IAgendaCalendarEvent[];
  isLoading: boolean;
  hasError: boolean;
  hasSchool: boolean;
}

function mapScheduleToEvent(schedule: IAgendaSchedule): IAgendaCalendarEvent {
  const start = schedule.start_time instanceof Date
    ? schedule.start_time
    : new Date(schedule.start_time);
  const end = schedule.end_time instanceof Date
    ? schedule.end_time
    : new Date(schedule.end_time);

  const fallbackTitle = schedule.students?.name
    ? `Aula com ${schedule.students.name}`
    : "Aula";

  return {
    id: schedule.id,
    title: schedule.title?.trim() || fallbackTitle,
    start,
    end,
    description: schedule.description ?? null,
    studentId: schedule.student_id,
    studentName: schedule.students?.name ?? null,
  };
}

export function useAgenda(): UseAgendaResult {
  const { school } = useSession();

  const [events, setEvents] = useState<IAgendaCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const requestCounter = useRef(0);

  useEffect(() => {
    if (!school?.id) {
      setEvents([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    let isMounted = true;
    const currentRequest = requestCounter.current + 1;
    requestCounter.current = currentRequest;

    const loadAgenda = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await getAgenda();

        if (isMounted && requestCounter.current === currentRequest) {
          if (response.success) {
            const schedules = (response.data ?? []).map(mapScheduleToEvent);
            setEvents(schedules);
            setHasError(false);
          } else {
            setEvents([]);
            setHasError(true);
            toast.error(response.message);
          }
        }
      } catch (error) {
        if (isMounted && requestCounter.current === currentRequest) {
          toast.error("Não foi possível carregar a agenda.");
          setHasError(true);
          setEvents([]);
        }
      } finally {
        if (isMounted && requestCounter.current === currentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadAgenda();

    return () => {
      isMounted = false;
    };
  }, [school?.id]);

  return {
    events,
    isLoading,
    hasError,
    hasSchool: Boolean(school?.id),
  };
}

