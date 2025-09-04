"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-styles.css";
import { useState } from "react";

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: "Reunião de Pais",
    start: new Date(2024, 11, 15, 10, 0), // December 15, 2024, 10:00 AM
    end: new Date(2024, 11, 15, 12, 0),   // December 15, 2024, 12:00 PM
  },
  {
    id: 2,
    title: "Atividade de Matemática",
    start: new Date(2024, 11, 18, 14, 0), // December 18, 2024, 2:00 PM
    end: new Date(2024, 11, 18, 15, 30),  // December 18, 2024, 3:30 PM
  },
  {
    id: 3,
    title: "Apresentação dos Alunos",
    start: new Date(2024, 11, 20, 9, 0),  // December 20, 2024, 9:00 AM
    end: new Date(2024, 11, 20, 11, 0),   // December 20, 2024, 11:00 AM
  },
];

export default function AgendaPage() {
  const [events] = useState(sampleEvents);

  const handleSelectEvent = (event: any) => {
    alert(`Evento: ${event.title}`);
  };

  const handleSelectSlot = (slotInfo: any) => {
    console.log("Selected slot:", slotInfo);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">Agenda</h1>
        <p className="text-muted-foreground">Gerencie seus eventos e compromissos</p>
      </div>
      
      <div className="flex-1 bg-background">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          views={["month", "week", "day", "agenda"]}
          defaultView="month"
          style={{ 
            height: "calc(100vh - 200px)",
            fontFamily: "inherit"
          }}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana", 
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Não há eventos neste período.",
            showMore: (total) => `+${total} mais`,
          }}
          formats={{
            monthHeaderFormat: "MMMM YYYY",
            dayHeaderFormat: "dddd, DD/MM/YYYY",
            dayRangeHeaderFormat: ({ start, end }) =>
              `${moment(start).format("DD/MM")} - ${moment(end).format("DD/MM/YYYY")}`,
            agendaDateFormat: "DD/MM/YYYY",
            agendaTimeFormat: "HH:mm",
            agendaTimeRangeFormat: ({ start, end }) =>
              `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
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
      </div>
    </div>
  );
}