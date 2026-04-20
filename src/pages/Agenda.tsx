import { useState, useEffect } from 'react';
import api from '../services/api';
import { ChevronLeft, ChevronRight, Clock, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentFormModal } from '../components/AppointmentFormModal';
import { toast } from 'sonner';

export function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8); // 08:00 às 18:00

  async function handleCancelAppointment(id: number) {
    if (confirm('Deseja realmente cancelar este agendamento?')) {
      try {
        await api.delete(`/agendamentos/${id}`);
        toast.success('Agendamento cancelado com sucesso!');
        loadAppointments();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao cancelar agendamento');
      }
    }
  }

  async function handleStatusChange(id: number, status: string) {
    try {
      await api.patch(`/agendamentos/${id}/status`, { status });
      toast.success('Status atualizado!');
      loadAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar status');
    }
  }

  async function loadAppointments() {
    const response = await api.get('/agendamentos', {
      params: { data: format(selectedDate, 'yyyy-MM-dd') }
    });
    setAppointments(response.data);
  }

  useEffect(() => { loadAppointments(); }, [selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2"><ChevronLeft /></button>
            <button onClick={() => setSelectedDate(new Date())} className="px-4 text-sm font-medium">Hoje</button>
            <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2"><ChevronRight /></button>
          </div>
          <h2 className="text-lg font-bold capitalize">{format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" /> Novo Agendamento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
        {timeSlots.map((hour) => {
          const timeString = `${hour.toString().padStart(2, '0')}:00`;
          const appointment = appointments.find(a => format(new Date(a.data_hora), 'HH:00') === timeString);

          return (
            <div key={hour} className="flex min-h-[80px]">
              <div className="w-20 p-4 text-sm font-bold text-slate-400 border-r border-slate-100 flex flex-col items-center">
                <Clock className="w-4 h-4 mb-1" />{timeString}
              </div>
              <div className="flex-1 p-2">
                {appointment ? (
                  <div className="h-full bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg flex justify-between items-center">
                    <p className="text-sm font-bold text-blue-900">
                      {appointment.paciente?.nome || `Paciente #${appointment.paciente_id}`}
                    </p>
                    <div className="flex gap-2 items-center">
                      <select 
                        value={appointment.status || 'agendado'}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className="text-xs font-medium bg-white border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="agendado">Agendado</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="realizado">Realizado</option>
                        <option value="faltou">Faltou</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                      <button onClick={() => handleCancelAppointment(appointment.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors" title="Deletar Agendamento">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setIsModalOpen(true)} className="w-full h-full border-2 border-dashed border-transparent hover:border-slate-200 text-slate-300 italic text-sm">
                    + Clique para agendar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <AppointmentFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadAppointments} selectedDate={selectedDate} />
    </div>
  );
}