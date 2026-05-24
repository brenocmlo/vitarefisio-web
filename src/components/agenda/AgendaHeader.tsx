import React, { memo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  LayoutGrid,
} from 'lucide-react';
import { format, subDays, subMonths, addDays, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgendaHeaderProps {
  viewMode: 'day' | 'month';
  setViewMode: (mode: 'day' | 'month') => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onConnectGoogle: () => Promise<void>;
  onOpenModal: (hour: string) => void;
}

export const AgendaHeader: React.FC<AgendaHeaderProps> = memo(({
  viewMode,
  setViewMode,
  selectedDate,
  setSelectedDate,
  onConnectGoogle,
  onOpenModal,
}) => {
  return (
    <section className="surface-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="surface-muted flex w-fit items-center gap-2 p-1.5">
            <button
              onClick={() => setViewMode('day')}
              className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${
                viewMode === 'day'
                  ? 'bg-sky-500 text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)]'
                  : 'text-slate-500 hover:bg-white/80 dark:text-slate-400 dark:hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Dia
              </span>
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-sky-500 text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)]'
                  : 'text-slate-500 hover:bg-white/80 dark:text-slate-400 dark:hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Mês
              </span>
            </button>
          </div>

          <div>
            <p className="eyebrow mb-2">Agenda terapêutica</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDate(viewMode === 'day' ? subDays(selectedDate, 1) : subMonths(selectedDate, 1))}
                className="icon-button h-10 w-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="font-display text-2xl font-extrabold capitalize text-slate-950 dark:text-slate-50">
                {format(selectedDate, viewMode === 'day' ? "dd 'de' MMMM" : 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <button
                onClick={() => setSelectedDate(viewMode === 'day' ? addDays(selectedDate, 1) : addMonths(selectedDate, 1))}
                className="icon-button h-10 w-10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onConnectGoogle}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-red-500/10 p-0.5">
              <svg viewBox="0 0 24 24" className="h-full w-full fill-red-500">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.52-1.2 1.2-2.84 2.12-5.72 2.12-4.2 0-7.76-3.48-7.76-7.84s3.56-7.84 7.76-7.84c2.28 0 3.92.88 5.16 2.08l2.32-2.32C18.16 3.08 15.68 2 12.48 2 6.44 2 1.56 6.88 1.56 12.92s4.88 10.92 10.92 10.92c3.28 0 5.76-1.08 7.64-3.08 1.92-1.92 2.52-4.64 2.52-6.92 0-.64-.04-1.24-.12-1.84h-10.04z" />
              </svg>
            </div>
            Google Calendar
          </button>
          <button onClick={() => onOpenModal('08:00')} className="primary-button w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Novo agendamento
          </button>
        </div>
      </div>
    </section>
  );
});
