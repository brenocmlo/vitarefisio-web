import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Calendar, Clock, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

function getApiMessage(error: any) {
  return error?.response?.data?.message || error?.response?.data?.error || 'Não foi possível concluir o agendamento.';
}

export function AppointmentFormModal({ isOpen, onClose, onSuccess, selectedDate, defaultHour }: any) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({ paciente_id: '', hora: '08:00', observacoes: '' });

  useEffect(() => {
    if (isOpen) {
      setFormData({ paciente_id: '', hora: defaultHour || '08:00', observacoes: '' });
      setFormError('');
      api.get('/pacientes').then((res) => {
        const patientsData = Array.isArray(res.data) ? res.data : res.data.data;
        setPatients(Array.isArray(patientsData) ? patientsData : []);
      });
    }
  }, [isOpen, defaultHour]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return toast.error('Sessão expirada. Faça login novamente.');

    try {
      setIsSubmitting(true);
      setFormError('');
      const dataFormatada = format(selectedDate, 'yyyy-MM-dd');
      const dataHoraFinal = `${dataFormatada}T${formData.hora}:00`;

      await api.post('/agendamentos', {
        paciente_id: Number(formData.paciente_id),
        data_hora: dataHoraFinal,
        observacoes: formData.observacoes,
        clinica_id: user?.clinica_id || 1,
        fisioterapeuta_id: user?.id,
      });

      toast.success('Agendamento concluído!');
      onSuccess();
      onClose();
    } catch (error: any) {
      const message = getApiMessage(error);
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card max-w-xl">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Novo agendamento</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Crie um atendimento com horário e observações iniciais.</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-button h-10 w-10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {formError && (
            <div
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                formError === 'Este horário já está ocupado na sua agenda.'
                  ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200'
                  : 'border-red-300 bg-red-50 text-red-900 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200'
              }`}
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">
                  {formError === 'Este horário já está ocupado na sua agenda.'
                    ? 'Horário indisponível'
                    : 'Não foi possível agendar'}
                </p>
                <p className="mt-1">{formError}</p>
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Paciente</label>
            <select
              required
              value={formData.paciente_id}
              onChange={(e) => {
                setFormError('');
                setFormData({ ...formData, paciente_id: e.target.value });
              }}
              className="select-shell"
            >
              <option value="">Selecione o paciente...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Horário</label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.hora}
                  onChange={(e) => {
                    setFormError('');
                    setFormData({ ...formData, hora: e.target.value });
                  }}
                  className="select-shell pl-11"
                >
                  {Array.from({ length: 11 }, (_, i) => i + 8).map((hour) => {
                    const time = `${hour.toString().padStart(2, '0')}:00`;
                    return (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Data</label>
              <div className="surface-muted flex h-[50px] items-center px-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {format(selectedDate, 'dd/MM/yyyy')}
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Observações</label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
              <textarea
                value={formData.observacoes}
                onChange={(e) => {
                  if (formError) setFormError('');
                  setFormData({ ...formData, observacoes: e.target.value });
                }}
                className="textarea-shell min-h-[120px] pl-11"
                placeholder="Observações clínicas ou administrativas do atendimento"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="secondary-button flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="primary-button flex-1 disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Agendando...
                </>
              ) : (
                'Confirmar agendamento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
