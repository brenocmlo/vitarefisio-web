import React, { memo } from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';

interface MonthCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: 'day' | 'month') => void;
  calendarDays: Date[];
  appointmentsByDay: Record<string, any[]>;
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const MonthCalendar: React.FC<MonthCalendarProps> = memo(({
  selectedDate,
  setSelectedDate,
  setViewMode,
  calendarDays,
  appointmentsByDay,
}) => {
  return (
    <section className="surface-panel overflow-hidden">
      <div className="grid grid-cols-7 border-b border-slate-200/70 dark:border-slate-800">
        {weekDays.map((day) => (
          <div key={day} className="px-1 py-3 text-center text-[10px] font-extrabold uppercase tracking-widest text-slate-500 sm:px-3 sm:py-4 sm:text-xs sm:tracking-[0.2em] dark:text-slate-400">
            <span className="sm:hidden">{day.charAt(0)}</span>
            <span className="hidden sm:inline">{day}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayAppointments = appointmentsByDay[dayKey] || [];

          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedDate(day);
                setViewMode('day');
              }}
              className={`min-h-[80px] sm:min-h-[132px] border-b border-r p-1 sm:p-3 text-left transition-colors ${
                !isSameMonth(day, selectedDate)
                  ? 'bg-slate-100/45 text-slate-400 dark:bg-slate-900/50 dark:text-slate-600'
                  : 'bg-transparent hover:bg-sky-500/[0.04] dark:hover:bg-sky-400/[0.05]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-6 w-6 sm:h-9 sm:w-9 items-center justify-center rounded-full text-[10px] sm:text-sm font-bold ${
                    isSameDay(day, new Date())
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {dayAppointments.length > 0 && (
                  <span className="rounded-full bg-sky-500/10 px-1 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                    {dayAppointments.length}
                  </span>
                )}
              </div>

              <div className="mt-2 hidden sm:block space-y-2">
                {dayAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="truncate rounded-xl bg-white/70 px-2.5 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
                  >
                    {format(new Date(appointment.data_hora), 'HH:mm')} · {appointment.paciente?.nome}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    +{dayAppointments.length - 3} agendamentos
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
});
