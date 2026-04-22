import React, { useState } from 'react';
import api from '../services/api';
import { X, Save, ClipboardList, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

interface EvolutionFormModalProps {
  isOpen: boolean;
  patientId: string | number;
  onClose: () => void;
  onSuccess: () => void;
}

export function EvolutionFormModal({ isOpen, patientId, onClose, onSuccess }: EvolutionFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subjetivo: '',
    objetivo: '',
    avaliacao: '',
    plano: '',
    cid_10: '',
    diagnostico_fisioterapeutico: '',
    objetivos_tratamento: '',
    agendamento_id: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/evolucoes', {
        ...formData,
        paciente_id: Number(patientId),
        agendamento_id: formData.agendamento_id ? Number(formData.agendamento_id) : undefined,
      });

      toast.success('Evolução registrada com sucesso!');
      onSuccess();
      onClose();
      setFormData({
        subjetivo: '',
        objetivo: '',
        avaliacao: '',
        plano: '',
        cid_10: '',
        diagnostico_fisioterapeutico: '',
        objetivos_tratamento: '',
        agendamento_id: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar evolução');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    {
      key: 'subjetivo',
      label: 'Subjetivo (S)',
      placeholder: 'Relato do paciente, dor, queixas e percepção funcional...',
      color: 'bg-sky-500',
    },
    {
      key: 'objetivo',
      label: 'Objetivo (O)',
      placeholder: 'Exame físico, testes, amplitude de movimento, força...',
      color: 'bg-emerald-500',
    },
    {
      key: 'avaliacao',
      label: 'Avaliação (A)',
      placeholder: 'Síntese clínica, resposta ao tratamento, interpretação profissional...',
      color: 'bg-amber-500',
    },
    {
      key: 'plano',
      label: 'Plano (P)',
      placeholder: 'Condutas, exercícios, orientações e próximos passos...',
      color: 'bg-violet-500',
    },
  ] as const;

  return (
    <div className="modal-backdrop">
      <div className="modal-card flex max-h-[90vh] max-w-4xl flex-col">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Registrar evolução clínica</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Estruture o atendimento no modelo SOAP com dados complementares.</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-button h-10 w-10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {sections.map((section) => (
              <div key={section.key} className="surface-muted p-4">
                <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  <span className={`h-2.5 w-2.5 rounded-full ${section.color}`} />
                  {section.label}
                </label>
                <textarea
                  required
                  placeholder={section.placeholder}
                  className="textarea-shell min-h-[140px]"
                  value={formData[section.key]}
                  onChange={(e) => setFormData({ ...formData, [section.key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="surface-panel p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-slate-50">Dados complementares</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Campos úteis para referência clínica e rastreabilidade.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <label className="form-label">CID-10</label>
                <input
                  type="text"
                  placeholder="M54.5"
                  className="input-shell uppercase"
                  value={formData.cid_10}
                  onChange={(e) => setFormData({ ...formData, cid_10: e.target.value })}
                />
              </div>
              <div className="lg:col-span-2">
                <label className="form-label">Código do agendamento</label>
                <input
                  type="number"
                  placeholder="Opcional"
                  className="input-shell"
                  value={formData.agendamento_id}
                  onChange={(e) => setFormData({ ...formData, agendamento_id: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <label className="form-label">Diagnóstico fisioterapêutico</label>
                <input
                  type="text"
                  placeholder="Ex: Redução da mobilidade em coluna lombar..."
                  className="input-shell"
                  value={formData.diagnostico_fisioterapeutico}
                  onChange={(e) => setFormData({ ...formData, diagnostico_fisioterapeutico: e.target.value })}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="modal-footer justify-end">
          <button type="button" onClick={onClose} className="secondary-button">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="primary-button">
            {isSubmitting ? (
              'Salvando...'
            ) : (
              <>
                <Save className="h-4 w-4" />
                Finalizar evolução
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
