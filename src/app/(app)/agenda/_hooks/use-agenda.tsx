"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useSession } from "@/hooks/useSession";
import { toast } from "@/lib/toast";

import type { IAgendaCalendarEvent, IAgendaSchedule } from "../_models";
import { getAgenda } from "../actions";

interface UseAgendaResult {
  events: IAgendaCalendarEvent[];
  isLoading: boolean;
  hasError: boolean;
  refetch: () => void;
}

function mapScheduleToEvent(schedule: IAgendaSchedule): IAgendaCalendarEvent {
  const start =
    schedule.start_time instanceof Date
      ? schedule.start_time
      : new Date(schedule.start_time);
  const end =
    schedule.end_time instanceof Date
      ? schedule.end_time
      : new Date(schedule.end_time);

  const students = schedule.schedules_students?.map((ss) => ss.students) ?? [];
  const studentIds = students.map((s) => s.id);
  const studentNames = students.map((s) => s.name);

  const fallbackTitle =
    studentNames.length > 0
      ? studentNames.length === 1
        ? `Aula com ${studentNames[0]}`
        : `Aula com ${studentNames.length} alunos`
      : "Aula";

  return {
    id: schedule.id,
    title: schedule.title?.trim() || fallbackTitle,
    start,
    end,
    description: schedule.description ?? null,
    studentIds,
    studentNames,
  };
}

const AgendaContext = createContext<UseAgendaResult | null>(null);

export function AgendaProvider({ children }: { children: ReactNode }) {
  const { school } = useSession();

  const [events, setEvents] = useState<IAgendaCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const loadAgenda = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await getAgenda();

      if (response.success) {
        const schedules = (response.data ?? []).map(mapScheduleToEvent);
        setEvents(schedules);
        setHasError(false);
      } else {
        setEvents([]);
        setHasError(true);
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Não foi possível carregar a agenda.");
      setHasError(true);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!school?.id) {
      setEvents([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }
    loadAgenda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school?.id]);

  return (
    <AgendaContext.Provider
      value={{ events, isLoading, hasError, refetch: loadAgenda }}
    >
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda(): UseAgendaResult {
  const ctx = useContext(AgendaContext);
  if (!ctx) {
    throw new Error("useAgenda deve ser usado dentro de AgendaProvider");
  }
  return ctx;
}
