import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  LayoutGrid,
  Clock3,
  XCircle,
  Loader2,
} from 'lucide-react';
import {
  format,
  addDays,
  subDays,
  getHours,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentFormModal } from '../components/AppointmentFormModal';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function Agenda() {
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('08:00');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  function getApiMessage(error: any) {
    return error?.response?.data?.message || error?.response?.data?.error || 'Não foi possível concluir a ação.';
  }

  async function loadAppointments() {
    try {
      const params: any = {};
      if (viewMode === 'day') {
        params.data = format(selectedDate, 'yyyy-MM-dd');
      } else {
        params.mes = format(selectedDate, 'MM');
        params.ano = format(selectedDate, 'yyyy');
      }
      const response = await api.get('/agendamentos', { params });
      setAppointments(response.data.filter((app: any) => app.status !== 'cancelado'));
    } catch (error) {
      console.error('Erro ao carregar agendamentos');
    }
  }

  function handleOpenModal(hora: string) {
    setSelectedHour(hora);
    setIsModalOpen(true);
  }

  async function handleStatusChange(agendamentoId: number, novoStatus: string) {
    try {
      await api.patch(`/agendamentos/${agendamentoId}/status`, { status: novoStatus });
      setAppointments((prev) =>
        prev.map((app) => (app.id === agendamentoId ? { ...app, status: novoStatus } : app))
      );
      toast.success('Status atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar status.');
    }
  }

  async function handleCancelAppointment(agendamentoId: number) {
    try {
      setCancellingId(agendamentoId);
      await api.delete(`/agendamentos/${agendamentoId}`);
      setAppointments((prev) => prev.filter((app) => app.id !== agendamentoId && app.status !== 'cancelado'));
      toast.success('Agendamento cancelado com sucesso.');
    } catch (error: any) {
      toast.error(getApiMessage(error));
    } finally {
      setCancellingId(null);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, [selectedDate, viewMode]);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(selectedDate)),
    end: endOfWeek(endOfMonth(selectedDate)),
  });

  const appointmentsByDay = useMemo(() => {
    return calendarDays.reduce<Record<string, any[]>>((acc, day) => {
      const key = format(day, 'yyyy-MM-dd');
      acc[key] = appointments.filter((appointment) => isSameDay(new Date(appointment.data_hora), day));
      return acc;
    }, {});
  }, [appointments, calendarDays]);

  return (
    <div className="space-y-6">
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

          <button onClick={() => handleOpenModal('08:00')} className="primary-button">
            <Plus className="h-4 w-4" />
            Novo agendamento
          </button>
        </div>
      </section>

      {viewMode === 'day' ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 11 }, (_, i) => i + 8).map((hour) => {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            const slotApps = appointments.filter((appointment) => getHours(new Date(appointment.data_hora)) === hour);

            return (
              <div key={hour} className="surface-card min-h-[220px] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Horário</p>
                    <h3 className="font-display text-2xl font-extrabold text-slate-950 dark:text-slate-50">{timeString}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
                    <Clock3 className="h-5 w-5" />
                  </div>
                </div>

                {slotApps.length > 0 ? (
                  <div className="space-y-3">
                    {slotApps.map((app) => {
                      const isDone = app.status === 'realizado';
                      const statusStyles = isDone
                        ? 'border-emerald-300/60 bg-emerald-500/10 dark:border-emerald-400/20 dark:bg-emerald-400/10'
                        : 'border-sky-300/60 bg-sky-500/10 dark:border-sky-400/20 dark:bg-sky-400/10';

                      return (
                        <div key={app.id} className={`rounded-[22px] border p-4 ${statusStyles}`}>
                          <Link
                            to={`/pacientes/${app.paciente_id}/prontuario`}
                            className="block text-sm font-bold text-slate-900 hover:text-sky-700 dark:text-slate-100 dark:hover:text-sky-300"
                          >
                            {app.paciente?.nome}
                          </Link>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Acompanhe evolução e detalhes do atendimento.</p>
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="select-shell mt-4 py-2 text-xs font-bold uppercase tracking-[0.16em]"
                          >
                            <option value="agendado">Agendado</option>
                            <option value="realizado">Realizado</option>
                            <option value="faltou">Faltou</option>
                          </select>
                          <div className="mt-3 grid grid-cols-1 gap-2">
                            <Link
                              to={`/pacientes/${app.paciente_id}/prontuario`}
                              className="secondary-button w-full justify-center px-3 py-2.5 text-center text-xs"
                            >
                              Ver prontuário
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleCancelAppointment(app.id)}
                              disabled={cancellingId === app.id}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-center text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200 dark:hover:bg-red-400/15"
                            >
                              {cancellingId === app.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Cancelando...
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 shrink-0" />
                                  <span className="whitespace-normal break-words leading-4">Cancelar agendamento</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenModal(timeString)}
                    className="flex h-[130px] w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/40 text-slate-400 transition-all hover:border-sky-300 hover:bg-sky-500/5 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950/20 dark:hover:border-sky-500 dark:hover:bg-sky-400/5 dark:hover:text-sky-300"
                  >
                    <Plus className="mb-2 h-5 w-5" />
                    <span className="text-sm font-semibold">Adicionar encaixe</span>
                  </button>
                )}
              </div>
            );
          })}
        </section>
      ) : (
        <section className="surface-panel overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200/70 dark:border-slate-800">
            {weekDays.map((day) => (
              <div key={day} className="px-3 py-4 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {day}
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
                  className={`min-h-[132px] border-b border-r p-3 text-left transition-colors ${
                    !isSameMonth(day, selectedDate)
                      ? 'bg-slate-100/45 text-slate-400 dark:bg-slate-900/50 dark:text-slate-600'
                      : 'bg-transparent hover:bg-sky-500/[0.04] dark:hover:bg-sky-400/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                        isSameDay(day, new Date())
                          ? 'bg-sky-500 text-white'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="rounded-full bg-sky-500/10 px-2 py-1 text-[10px] font-bold text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
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
      )}

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadAppointments}
        selectedDate={selectedDate}
        defaultHour={selectedHour}
      />
    </div>
  );
}
