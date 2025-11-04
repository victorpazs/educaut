"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-styles.css";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { PageLoader } from "@/components/page-loader";

import { useAgenda } from "./_hooks/use-agenda";

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

export default function AgendaPage() {
  const { events, isLoading, hasSchool } = useAgenda();

  return (
    <div className="h-full gap-2 flex flex-col">
      <PageHeader title="Agenda" subtitle="Organize as suas próximas aulas" />

      <Card className="flex-1">
        {isLoading ? (
          <PageLoader />
        ) : (
          <Calendar
            localizer={localizer}
            events={hasSchool ? events : []}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            defaultView="month"
            toolbar={false}
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
              previous: "Anterior",
              next: "Próximo",
              yesterday: "Ontem",
              tomorrow: "Amanhã",
              today: "Hoje",
              agenda: "Agenda",
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
            eventPropGetter={() => ({
              style: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
              },
            })}
          />
        )}
      </Card>
    </div>
  );
}
