"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PageLoader } from "@/components/page-loader";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import type {
  DatesSetArg,
  EventSourceInput,
  CalendarApi,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/core";

import { useAgenda } from "../_hooks/use-agenda";

import "./calendar-styles.css";
import { cn } from "@/lib/utils";

type FullCalendarView = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

const views: { id: FullCalendarView; label: string }[] = [
  { id: "dayGridMonth", label: "Mês" },
  { id: "timeGridWeek", label: "Semana" },
  { id: "timeGridDay", label: "Dia" },
];

export function SchoolAgenda({
  isPreviewMode = false,
}: {
  isPreviewMode?: boolean;
}) {
  const { events, isLoading, refetch } = useAgenda();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentView, setCurrentView] =
    useState<FullCalendarView>("dayGridMonth");
  const [calendarTitle, setCalendarTitle] = useState<string>("");
  const fcEvents: EventSourceInput = useMemo(() => {
    return events.map((e) => ({
      id: String(e.id),
      title: e.title,
      start: e.start,
      end: e.end,
    }));
  }, [events]);

  const handleChangeView = (nextView: FullCalendarView) => {
    setCurrentView(nextView);
    const api: CalendarApi | undefined = calendarRef.current?.getApi?.();
    api?.changeView(nextView);
    setCalendarTitle(api?.view?.title ?? "");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isMobile && currentView !== "timeGridDay") {
      const api: CalendarApi | undefined = calendarRef.current?.getApi?.();
      setCurrentView("timeGridDay");
      api?.changeView("timeGridDay");
      setCalendarTitle(api?.view?.title ?? "");
    }
  }, [isMobile, currentView]);

  const nav = {
    today: () => {
      const api: CalendarApi | undefined = calendarRef.current?.getApi?.();
      api?.today();
      setCalendarTitle(api?.view?.title ?? "");
    },
    prev: () => {
      const api: CalendarApi | undefined = calendarRef.current?.getApi?.();
      api?.prev();
      setCalendarTitle(api?.view?.title ?? "");
    },
    next: () => {
      const api: CalendarApi | undefined = calendarRef.current?.getApi?.();
      api?.next();
      setCalendarTitle(api?.view?.title ?? "");
    },
  };

  return (
    <>
      <Card
        className={cn(
          "flex-1 overflow-hidden relative",
          isPreviewMode ? "group" : ""
        )}
      >
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center flex-wrap md:justify-between justify-center gap-4 px-4 py-3">
              <div className="flex items-center gap-2">
                <Tabs defaultValue="idle">
                  <TabsList>
                    <TabsTrigger
                      value="prev"
                      aria-label="Anterior"
                      onClick={nav.prev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="next"
                      aria-label="Próximo"
                      onClick={nav.next}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="text-lg min-w-64 flex items-center justify-center font-semibold text-foreground">
                {calendarTitle}
              </div>
              <Tabs
                value={currentView}
                onValueChange={(value) =>
                  handleChangeView(value as FullCalendarView)
                }
                className="hidden md:flex"
              >
                <TabsList>
                  {views.map((v) => (
                    <TabsTrigger key={v.id} value={v.id}>
                      {v.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div>
              <div
                className={cn(
                  isPreviewMode
                    ? "pointer-events-none cursor-pointer transition-all duration-200 ease-out group-hover:blur-xs group-hover:opacity-60"
                    : ""
                )}
              >
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={currentView}
                  headerToolbar={false}
                  height="calc(100vh - 250px)"
                  locale={ptBrLocale}
                  dayMaxEvents={true}
                  selectable={true}
                  selectMirror={true}
                  nowIndicator={true}
                  events={fcEvents ?? []}
                  select={(info: DateSelectArg) => {
                    const params = new URLSearchParams();
                    params.set("start", info.start.toISOString());
                    params.set("end", info.end.toISOString());
                    router.push(`/agenda/create?${params.toString()}`);
                  }}
                  eventClick={(clickInfo: EventClickArg) => {
                    router.push(`/agenda/edit/${clickInfo.event.id}`);
                  }}
                  datesSet={(info: DatesSetArg) => {
                    setCurrentView(info.view.type as FullCalendarView);
                    setCalendarTitle(info.view.title);
                  }}
                  slotMinTime="00:00:00"
                  slotMaxTime="24:00:00"
                  allDaySlot={false}
                  slotDuration="01:00:00"
                  scrollTime="06:00:00"
                  eventDisplay="block"
                  moreLinkText="mais"
                  slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {isPreviewMode && (
          <div
            onClick={() => router.push("/agenda")}
            className="cursor-pointer absolute inset-0 flex flex-col items-center justify-center text-black opacity-0 transition-all duration-200 ease-out group-hover:opacity-100"
          >
            <ArrowRight className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground font-bold tracking-wide">
              Acessar agenda
            </span>
          </div>
        )}
      </Card>
    </>
  );
}
