import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  Clock,
  Plus,
  ArrowUpRight,
  CreditCard,
  Wallet
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
// IMPORTAÇÃO DO MODAL
import { PaymentFormModal } from '../components/PaymentFormModal'; 

export function Financeiro() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o Modal
  const [stats, setStats] = useState({
    totalRecebido: 0,
    aReceber: 0,
    faturamentoMes: 0
  });
  const [transacoes, setTransacoes] = useState<any[]>([]);

  async function loadFinanceiro() {
    try {
      setLoading(true);
      const response = await api.get('/pagamentos');
      
      if (response.data.stats) {
        setStats(response.data.stats);
        setTransacoes(response.data.recentes);
      } else {
        setTransacoes(response.data);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados financeiros");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFinanceiro();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-slate-400 font-medium">Carregando balanço financeiro...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Fluxo de Caixa</h1>
          <p className="text-sm text-slate-500 font-medium">Controle de entradas e previsões da clínica</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="capitalize">{format(new Date(), 'MMMM yyyy', { locale: ptBR })}</span>
          </div>
          
          {/* BOTÃO AGORA FUNCIONAL */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* CARDS DE RESUMO (DASHBOARD) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-16 h-16 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Recebido</p>
          <h3 className="text-3xl font-black text-slate-800">
            R$ {stats.totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" /> SALDO EM CONTA
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-16 h-16 text-amber-600" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">A Receber / Pendente</p>
          <h3 className="text-3xl font-black text-slate-800">
            R$ {stats.aReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center gap-1.5 text-amber-600 text-[10px] font-bold bg-amber-50 w-fit px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> AGUARDANDO PAGAMENTO
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <DollarSign className="w-16 h-16 text-white" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Faturamento Total</p>
          <h3 className="text-3xl font-black text-white">
            R$ {stats.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total bruto acumulado no mês</p>
        </div>
      </div>

      {/* TABELA DE MOVIMENTAÇÕES RECENTES */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-600" />
            Últimas Movimentações
          </h3>
          <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:text-blue-800 transition-colors">
            Exportar Relatório
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-[10px] uppercase tracking-widest text-slate-400 font-black">
                <th className="px-6 py-4 border-b border-slate-50">Status</th>
                <th className="px-6 py-4 border-b border-slate-50">Paciente / Origem</th>
                <th className="px-6 py-4 border-b border-slate-50">Data</th>
                <th className="px-6 py-4 border-b border-slate-50">Forma</th>
                <th className="px-6 py-4 border-b border-slate-50 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transacoes.length > 0 ? transacoes.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-all cursor-default">
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter ${
                      t.status === 'pago' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{t.paciente?.nome || 'Lançamento Avulso'}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Ref:</span>
                       <span className="text-[9px] font-mono font-bold text-blue-500">#{t.agendamento_id || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">
                        {format(new Date(t.created_at || new Date()), 'dd/MM/yyyy')}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">
                        Às {format(new Date(t.created_at || new Date()), 'HH:mm')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-xs font-bold text-slate-500 capitalize">{t.forma_pagamento || t.metodo_pagamento}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-slate-800 font-mono">
                      R$ {Number(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <DollarSign className="w-10 h-10 text-slate-100" />
                      <p className="text-slate-400 text-sm font-medium italic">Nenhuma movimentação financeira encontrada.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPONENTE DO MODAL INSERIDO AQUI */}
      <PaymentFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadFinanceiro}
      />
    </div>
  );
}