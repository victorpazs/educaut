"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageLoader } from "@/components/page-loader";
import moment from "moment";
import {
  Calendar,
  momentLocalizer,
  type EventPropGetter,
  type ToolbarProps,
} from "react-big-calendar";

import { useAgenda } from "../_hooks/use-agenda";
import type { IAgendaCalendarEvent } from "../_models";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../calendar-styles.css";

const localizer = momentLocalizer(moment);
moment.locale("pt-br");

const eventStyleGetter: EventPropGetter<IAgendaCalendarEvent> = () => ({
  style: {
    backgroundColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
  },
});

const calendarViews = ["day", "month", "agenda"] as const;

const CalendarToolbar = ({
  localizer,
  view,
  onView,
}: ToolbarProps<IAgendaCalendarEvent>) => {
  const labels = localizer.messages as Record<string, string>;

  return (
    <div className="flex justify-end gap-2 px-4 py-3">
      {calendarViews.map((calendarView) => (
        <Button
          key={calendarView}
          size="sm"
          variant={view === calendarView ? "default" : "outline"}
          onClick={() => onView(calendarView)}
        >
          {labels[calendarView] ?? calendarView}
        </Button>
      ))}
    </div>
  );
};

export function SchoolAgenda() {
  const { events, isLoading, hasSchool } = useAgenda();

  return (
    <Card className="flex-1">
      {isLoading ? (
        <PageLoader />
      ) : (
        <Calendar
          localizer={localizer}
          events={hasSchool ? events : []}
          startAccessor="start"
          endAccessor="end"
          views={calendarViews}
          defaultView="month"
          components={{
            toolbar: CalendarToolbar,
          }}
          style={{
            height: "calc(100vh - 250px)",
            fontFamily: "inherit",
            borderRadius: 12,
          }}
          messages={{
            date: "Data",
            time: "Hora",
            event: "Evento",
            allDay: "Dia todo",
            week: "Semana",
            work_week: "Semana de trabalho",
            day: "Dia",
            month: "Mês",
            yesterday: "Ontem",
            tomorrow: "Amanhã",
            agenda: "Ano",
            noEventsInRange: "Não há eventos neste período.",
            showMore: (total) => `+${total} mais`,
          }}
          formats={{
            monthHeaderFormat: "MMMM YYYY",
            dayHeaderFormat: "dddd, DD/MM/YYYY",
            dayRangeHeaderFormat: ({ start, end }) =>
              `${moment(start).format("DD/MM")} - ${moment(end).format(
                "DD/MM/YYYY"
              )}`,
            agendaDateFormat: "DD/MM/YYYY",
            agendaTimeFormat: "HH:mm",
            agendaTimeRangeFormat: ({ start, end }) =>
              `${moment(start).format("HH:mm")} - ${moment(end).format(
                "HH:mm"
              )}`,
            weekdayFormat: "ddd",
            dayFormat: "DD",
          }}
          eventPropGetter={eventStyleGetter}
        />
      )}
    </Card>
  );
}
