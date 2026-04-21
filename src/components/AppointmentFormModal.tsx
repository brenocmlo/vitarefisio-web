import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

export function AppointmentFormModal({ isOpen, onClose, onSuccess, selectedDate, defaultHour }: any) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [formData, setFormData] = useState({ paciente_id: '', hora: '08:00', observacoes: '' });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, hora: defaultHour }));
      api.get('/pacientes').then(res => setPatients(res.data));
    }
  }, [isOpen, defaultHour]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return toast.error("Sessão expirada. Faça login novamente.");

    try {
      // 1. Extrai apenas o dia, mês e ano da data selecionada no calendário
      const dataFormatada = format(selectedDate, 'yyyy-MM-dd');
      
      // 2. Monta a string no padrão ISO 8601 EXATO exigido pelo backend
      // O "-03:00" avisa o servidor que esta é a hora local do Brasil,
      // impedindo que o banco de dados adicione horas e jogue para o dia seguinte.
      const dataHoraFinal = `${dataFormatada}T${formData.hora}:00-03:00`;

      await api.post('/agendamentos', {
        paciente_id: Number(formData.paciente_id),
        data_hora: dataHoraFinal,
        observacoes: formData.observacoes,
        clinica_id: user?.clinica_id || 1,
        fisioterapeuta_id: user?.id
      });

      toast.success("Agendamento concluído!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao agendar.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold flex items-center gap-2 text-slate-800">
            <Calendar className="text-blue-600" /> Novo Agendamento
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <select 
            required 
            value={formData.paciente_id} 
            onChange={e => setFormData({...formData, paciente_id: e.target.value})} 
            className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o Paciente...</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <select 
              value={formData.hora} 
              onChange={e => setFormData({...formData, hora: e.target.value})} 
              className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 11 }, (_, i) => i + 8).map(h => {
                const time = `${h.toString().padStart(2, '0')}:00`;
                return <option key={time} value={time}>{time}</option>
              })}
            </select>
            <div className="p-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-600 text-center">
              {format(selectedDate, "dd/MM/yyyy")}
            </div>
          </div>
          <textarea 
            value={formData.observacoes} 
            onChange={e => setFormData({...formData, observacoes: e.target.value})} 
            className="w-full p-3 border rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Observações (Opcional)" 
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
          >
            Confirmar Agendamento
          </button>
        </form>
      </div>
    </div>
  );
}