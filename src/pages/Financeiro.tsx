import { useState, useEffect } from 'react';
import api from '../services/api';
import { DollarSign, ArrowUpCircle, TrendingUp, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export function Financeiro() {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    valor: '',
    forma_pagamento: 'pix',
    paciente_id: '',
    agendamento_id: '',
  });

  async function loadPagamentos() {
    try {
      setLoading(true);
      const response = await api.get('/pagamentos');
      setPagamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar financeiro', error);
      toast.error('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPagamentos();
  }, []);

  async function handleRegisterPayment(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/pagamentos', {
        valor: Number(formData.valor),
        forma_pagamento: formData.forma_pagamento,
        paciente_id: formData.paciente_id ? Number(formData.paciente_id) : undefined,
        agendamento_id: formData.agendamento_id ? Number(formData.agendamento_id) : undefined,
      });
      toast.success('Pagamento registrado com sucesso!');
      setIsModalOpen(false);
      setFormData({ valor: '', forma_pagamento: 'pix', paciente_id: '', agendamento_id: '' });
      loadPagamentos();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao registrar pagamento');
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalReceitas = pagamentos.reduce((acc, curr) => acc + Number(curr.valor), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Financeiro</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Registrar Pagamento
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <ArrowUpCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Receitas Totais</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceitas)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pagamentos Realizados</p>
            <h3 className="text-2xl font-bold text-slate-800">{pagamentos.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="p-3 bg-white/10 rounded-lg">
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Saldo Atual</p>
            <h3 className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceitas)}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabela de Pagamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-800">Histórico de Transações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Paciente</th>
                <th className="px-6 py-4 font-medium">Forma de Pagto</th>
                <th className="px-6 py-4 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">Carregando financeiro...</td>
                </tr>
              ) : pagamentos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">Nenhum pagamento registrado.</td>
                </tr>
              ) : (
                pagamentos.map((pagamento) => (
                  <tr key={pagamento.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {format(new Date(pagamento.data_pagamento), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {pagamento.paciente?.nome || `Paciente #${pagamento.paciente_id}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md text-xs font-bold uppercase bg-slate-100 text-slate-600">
                        {pagamento.forma_pagamento}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(pagamento.valor))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Simplificado de Pagamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800">Novo Pagamento</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegisterPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Forma de Pagamento</label>
                <select 
                  value={formData.forma_pagamento}
                  onChange={(e) => setFormData({...formData, forma_pagamento: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="pix">PIX</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">ID do Paciente</label>
                  <input 
                    type="number" 
                    required
                    value={formData.paciente_id}
                    onChange={(e) => setFormData({...formData, paciente_id: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">ID Agendamento (Opcional)</label>
                  <input 
                    type="number" 
                    value={formData.agendamento_id}
                    onChange={(e) => setFormData({...formData, agendamento_id: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all"
                >
                  {isSubmitting ? 'Salvando...' : 'Registrar Pagamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
