import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, DollarSign, CreditCard, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultPacienteId?: string;
  defaultIsPacote?: boolean;
}

const paymentMethods = ['pix', 'dinheiro', 'cartao_credito', 'convenio'] as const;

export function PaymentFormModal({
  isOpen,
  onClose,
  onSuccess,
  defaultPacienteId,
  defaultIsPacote = false,
}: PaymentFormModalProps) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    paciente_id: defaultPacienteId || '',
    valor: '',
    forma_pagamento: 'pix',
    is_pacote: defaultIsPacote,
    quantidade_sessoes: '10',
    status: 'pago',
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/pacientes').then((response) => setPatients(response.data));
      setFormData({
        paciente_id: defaultPacienteId || '',
        valor: '',
        forma_pagamento: 'pix',
        is_pacote: defaultIsPacote,
        quantidade_sessoes: '10',
        status: 'pago',
      });
    }
  }, [isOpen, defaultPacienteId, defaultIsPacote]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/pagamentos', {
        ...formData,
        paciente_id: Number(formData.paciente_id),
        valor: Number(formData.valor),
        quantidade_sessoes: formData.is_pacote ? Number(formData.quantidade_sessoes) : 1,
        clinica_id: user?.clinica_id || 1,
      });
      toast.success(formData.is_pacote ? 'Pacote ativado com sucesso!' : 'Pagamento registrado!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao processar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card max-w-xl">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Novo lançamento</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Registre sessão avulsa ou venda de pacote.</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-button h-10 w-10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="surface-muted flex gap-2 p-1.5">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_pacote: false })}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                !formData.is_pacote
                  ? 'bg-sky-500 text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)]'
                  : 'text-slate-500 hover:bg-white/80 dark:text-slate-400 dark:hover:bg-slate-900/60'
              }`}
            >
              Sessão avulsa
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_pacote: true })}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                formData.is_pacote
                  ? 'bg-sky-500 text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)]'
                  : 'text-slate-500 hover:bg-white/80 dark:text-slate-400 dark:hover:bg-slate-900/60'
              }`}
            >
              Pacote de sessões
            </button>
          </div>

          <div>
            <label className="form-label">Paciente</label>
            <select
              required
              value={formData.paciente_id}
              onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
              className="select-shell"
            >
              <option value="">Selecione...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={`grid gap-4 ${formData.is_pacote ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <label className="form-label">Valor total</label>
              <input
                required
                type="number"
                placeholder="0,00"
                className="input-shell"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </div>
            {formData.is_pacote && (
              <div>
                <label className="form-label">Número de sessões</label>
                <div className="relative">
                  <Layers className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    className="input-shell pl-11"
                    value={formData.quantidade_sessoes}
                    onChange={(e) => setFormData({ ...formData, quantidade_sessoes: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="form-label">Forma de pagamento</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData({ ...formData, forma_pagamento: method })}
                  className={`rounded-2xl border px-3 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                    formData.forma_pagamento === method
                      ? 'border-sky-400/40 bg-sky-500 text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)]'
                      : 'border-slate-200 bg-white/60 text-slate-500 hover:border-sky-300 hover:bg-sky-500/5 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" />
                    {method.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="secondary-button flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="primary-button flex-1">
              {isSubmitting ? 'Processando...' : 'Confirmar recebimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
