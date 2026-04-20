import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { X, Loader2, CalendarCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

const appointmentSchema = z.object({
  paciente_id: z.string().nonempty('Selecione um paciente'),
  fisioterapeuta_id: z.string().nonempty('Selecione um fisioterapeuta'),
  data: z.string().nonempty('Data obrigatória'),
  hora: z.string().nonempty('Hora obrigatória'),
  observacoes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export function AppointmentFormModal({ isOpen, onClose, onSuccess, selectedDate }: any) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [fisioterapeutas, setFisioterapeutas] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('/pacientes', { params: { clinica_id: user?.clinica_id } }).then(res => setPatients(res.data));
      api.get('/fisioterapeutas', { params: { clinica_id: user?.clinica_id } }).then(res => setFisioterapeutas(res.data));
    }
  }, [isOpen, user?.clinica_id]);

  const { register, handleSubmit, formState: { errors } } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      data: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      fisioterapeuta_id: user?.id ? String(user.id) : ''
    }
  });

  if (!isOpen) return null;

  async function handleSchedule(data: AppointmentFormValues) {
    try {
      setIsSubmitting(true);
      // Combinar data e hora para o formato que o backend espera
      const data_hora = `${data.data}T${data.hora}:00`;
      
      await api.post('/agendamentos', {
        clinica_id: user?.clinica_id,
        paciente_id: Number(data.paciente_id),
        fisioterapeuta_id: Number(data.fisioterapeuta_id),
        data_hora,
        observacoes: data.observacoes,
        status: 'agendado'
      });

      toast.success('Consulta agendada!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Horário indisponível ou erro no sistema.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-blue-600" /> Agendar Sessão
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleSchedule)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
            <select 
              {...register('paciente_id')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione um paciente...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            {errors.paciente_id && <p className="text-xs text-red-500 mt-1">{errors.paciente_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fisioterapeuta</label>
            <select 
              {...register('fisioterapeuta_id')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione um fisioterapeuta...</option>
              {fisioterapeutas.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
              {fisioterapeutas.length === 0 && user && (
                <option value={user.id}>{user.nome} (Você)</option>
              )}
            </select>
            {errors.fisioterapeuta_id && <p className="text-xs text-red-500 mt-1">{errors.fisioterapeuta_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
              <input type="date" {...register('data')} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
              <input type="time" {...register('hora')} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  );
}