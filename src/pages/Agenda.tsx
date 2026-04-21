import { useState, useEffect } from "react";
import api from "../services/api";
import {
  ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalendarIcon, LayoutGrid
} from "lucide-react";
import { 
  format, addDays, subDays, getHours, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, addMonths, subMonths 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentFormModal } from "../components/AppointmentFormModal";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function Agenda() {
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("08:00");

  async function loadAppointments() {
    try {
      const params: any = {};
      if (viewMode === 'day') {
        params.data = format(selectedDate, "yyyy-MM-dd");
      } else {
        params.mes = format(selectedDate, "MM");
        params.ano = format(selectedDate, "yyyy");
      }
      const response = await api.get("/agendamentos", { params });
      setAppointments(response.data.filter((app: any) => app.status !== "cancelado"));
    } catch (error) {
      console.error("Erro ao carregar agendamentos");
    }
  }

  function handleOpenModal(hora: string) {
    setSelectedHour(hora);
    setIsModalOpen(true);
  }

  async function handleStatusChange(agendamentoId: number, novoStatus: string) {
    try {
      await api.patch(`/agendamentos/${agendamentoId}/status`, { status: novoStatus });
      setAppointments(prev => prev.map(app => app.id === agendamentoId ? { ...app, status: novoStatus } : app));
      toast.success("Status atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  }

  useEffect(() => { loadAppointments(); }, [selectedDate, viewMode]);

  const calendarDays = eachDayOfInterval({ 
    start: startOfWeek(startOfMonth(selectedDate)), 
    end: endOfWeek(endOfMonth(selectedDate)) 
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setViewMode('day')} className={`p-2 rounded-lg text-xs font-bold ${viewMode === 'day' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('month')} className={`p-2 rounded-lg text-xs font-bold ${viewMode === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}><CalendarIcon className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedDate(viewMode === 'day' ? subDays(selectedDate, 1) : subMonths(selectedDate, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft /></button>
            <h2 className="text-lg font-bold capitalize">{format(selectedDate, viewMode === 'day' ? "dd 'de' MMMM" : "MMMM yyyy", { locale: ptBR })}</h2>
            <button onClick={() => setSelectedDate(viewMode === 'day' ? addDays(selectedDate, 1) : addMonths(selectedDate, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight /></button>
          </div>
        </div>
        <button onClick={() => handleOpenModal("08:00")} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">Novo Agendamento</button>
      </div>

      {viewMode === 'day' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 11 }, (_, i) => i + 8).map(hour => {
            const timeString = `${hour.toString().padStart(2, "0")}:00`;
            const slotApps = appointments.filter(a => getHours(new Date(a.data_hora)) === hour);
            return (
              <div key={hour} className="h-48">
                {slotApps.length > 0 ? slotApps.map(app => (
                  <div key={app.id} className={`h-full p-4 rounded-2xl border-2 flex flex-col justify-between ${app.status === 'realizado' ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'}`}>
                    <span className="text-[10px] font-black text-slate-400">{timeString}</span>
                    <Link to={`/pacientes/${app.paciente_id}/prontuario`} className="font-bold text-sm leading-tight text-slate-800">{app.paciente?.nome}</Link>
                    <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)} className={`w-full text-[10px] font-bold rounded-lg border-0 py-1 ${app.status === 'realizado' ? 'bg-emerald-500 text-white' : 'bg-white shadow-sm'}`}>
                      <option value="agendado">Agendado</option>
                      <option value="realizado">Realizado</option>
                      <option value="faltou">Faltou</option>
                    </select>
                  </div>
                )) : (
                  <button onClick={() => handleOpenModal(timeString)} className="w-full h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 hover:border-blue-300 hover:bg-blue-50/50 group transition-all">
                    <span className="text-xs font-bold">{timeString}</span>
                    <Plus className="group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden grid grid-cols-7">
          {calendarDays.map((day, idx) => (
            <div key={idx} onClick={() => { setSelectedDate(day); setViewMode('day'); }} className={`min-h-[100px] p-2 border-b border-r border-slate-50 cursor-pointer ${!isSameMonth(day, selectedDate) ? 'bg-slate-50/50' : 'bg-white'}`}>
              <span className={`text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>{format(day, 'd')}</span>
            </div>
          ))}
        </div>
      )}
      <AppointmentFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadAppointments} selectedDate={selectedDate} defaultHour={selectedHour} />
    </div>
  );
}