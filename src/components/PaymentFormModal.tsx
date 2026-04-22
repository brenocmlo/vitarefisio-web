import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, DollarSign, User, CreditCard, Layers, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultPacienteId?: string; // Pré-seleciona paciente (ex: quando aberto do prontuário)
  defaultIsPacote?: boolean;  // Abre direto no modo pacote
}

export function PaymentFormModal({ isOpen, onClose, onSuccess, defaultPacienteId, defaultIsPacote = false }: PaymentFormModalProps) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    paciente_id: defaultPacienteId || '',
    valor: '',
    forma_pagamento: 'pix',
    is_pacote: defaultIsPacote,
    quantidade_sessoes: '10',
    status: 'pago'
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/pacientes').then(response => setPatients(response.data));
      // Sincroniza as defaults sempre que o modal abre
      setFormData(prev => ({
        ...prev,
        paciente_id: defaultPacienteId || prev.paciente_id,
        is_pacote: defaultIsPacote
      }));
    }
  }, [isOpen]);

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
        clinica_id: user?.clinica_id || 1
      });
      toast.success(formData.is_pacote ? "Pacote ativado com sucesso!" : "Pagamento registrado!");
      onSuccess();
      onClose();
      setFormData({ paciente_id: defaultPacienteId || '', valor: '', forma_pagamento: 'pix', is_pacote: defaultIsPacote, quantidade_sessoes: '10', status: 'pago' });
    } catch (error: any) {
      toast.error("Erro ao processar.");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" /> Novo Lançamento
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* TIPO DE LANÇAMENTO (AVULSO VS PACOTE) */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => setFormData({...formData, is_pacote: false})}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!formData.is_pacote ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >Sessão Avulsa</button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, is_pacote: true})}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.is_pacote ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >Pacote de Sessões</button>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Paciente</label>
            <select required value={formData.paciente_id} onChange={e => setFormData({...formData, paciente_id: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Valor Total</label>
              <input required type="number" placeholder="0,00" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} />
            </div>
            {formData.is_pacote && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nº de Sessões</label>
                <input type="number" className="w-full p-2.5 border border-blue-200 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm outline-none" value={formData.quantidade_sessoes} onChange={e => setFormData({...formData, quantidade_sessoes: e.target.value})} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Forma de Pagamento</label>
            <div className="grid grid-cols-2 gap-2">
              {['pix', 'dinheiro', 'cartao_credito', 'convenio'].map((m) => (
                <button key={m} type="button" onClick={() => setFormData({...formData, forma_pagamento: m})} className={`p-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${formData.forma_pagamento === m ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>{m.replace('_', ' ')}</button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50">
            {isSubmitting ? "Processando..." : "Confirmar Recebimento"}
          </button>
        </form>
      </div>
    </div>
  );
}