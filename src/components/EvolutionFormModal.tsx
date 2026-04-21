import React, { useState } from 'react';
import api from '../services/api';
import { X, Save, ClipboardList, Activity, Target, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

interface EvolutionFormModalProps {
  isOpen: boolean;
  patientId: string | number;
  onClose: () => void;
  onSuccess: () => void;
}

export function EvolutionFormModal({ isOpen, patientId, onClose, onSuccess }: EvolutionFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado inicial focado no padrão SOAP
  const [formData, setFormData] = useState({
    subjetivo: '',
    objetivo: '',
    avaliacao: '',
    plano: '',
    cid_10: '',
    diagnostico_fisioterapeutico: '',
    objetivos_tratamento: '',
    agendamento_id: '', // Opcional para atendimentos avulsos
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/evolucoes', {
        ...formData,
        paciente_id: Number(patientId),
        // Se não houver agendamento_id, o backend pode tratar como evolução avulsa ou podemos validar
        agendamento_id: formData.agendamento_id ? Number(formData.agendamento_id) : undefined
      });

      toast.success('Evolução registrada com sucesso!');
      onSuccess();
      onClose();
      // Limpa o form para o próximo uso
      setFormData({
        subjetivo: '', objetivo: '', avaliacao: '', plano: '',
        cid_10: '', diagnostico_fisioterapeutico: '', objetivos_tratamento: '',
        agendamento_id: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar evolução');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Registrar Evolução Clínica</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Metodologia SOAP</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORMULÁRIO COM SCROLL */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SEÇÃO SOAP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Subjetivo (S)
              </label>
              <textarea 
                required
                placeholder="Relato do paciente, dor, queixas..."
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
                value={formData.subjetivo}
                onChange={e => setFormData({...formData, subjetivo: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Objetivo (O)
              </label>
              <textarea 
                required
                placeholder="Exame físico, testes, ADM, força..."
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
                value={formData.objetivo}
                onChange={e => setFormData({...formData, objetivo: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Avaliação (A)
              </label>
              <textarea 
                required
                placeholder="Impressão profissional, evolução do quadro..."
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
                value={formData.avaliacao}
                onChange={e => setFormData({...formData, avaliacao: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span> Plano (P)
              </label>
              <textarea 
                required
                placeholder="Condutas, exercícios, orientações..."
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
                value={formData.plano}
                onChange={e => setFormData({...formData, plano: e.target.value})}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SEÇÃO CLÍNICA EXTRA */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-slate-400" /> Dados Complementares
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-600 mb-1">CID-10</label>
                <input 
                  type="text" 
                  placeholder="M54.5"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm uppercase"
                  value={formData.cid_10}
                  onChange={e => setFormData({...formData, cid_10: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Cód. Agendamento (Opcional)</label>
                <input 
                  type="number" 
                  placeholder="Ex: 102"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  value={formData.agendamento_id}
                  onChange={e => setFormData({...formData, agendamento_id: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Diagnóstico Fisioterapêutico</label>
              <input 
                type="text" 
                placeholder="Ex: Redução da mobilidade em coluna lombar..."
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                value={formData.diagnostico_fisioterapeutico}
                onChange={e => setFormData({...formData, diagnostico_fisioterapeutico: e.target.value})}
              />
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all"
          >
            {isSubmitting ? 'Salvando...' : (
              <>
                <Save className="w-4 h-4" /> Finalizar Evolução
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}