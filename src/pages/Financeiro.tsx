import { useState, useEffect } from 'react';
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
  Wallet,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { PaymentFormModal } from '../components/PaymentFormModal';

export function Financeiro() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRecebido: 0,
    aReceber: 0,
    faturamentoMes: 0,
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
      toast.error('Erro ao carregar dados financeiros');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFinanceiro();
  }, []);

  if (loading) {
    return (
      <div className="surface-panel flex min-h-[260px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600 dark:border-slate-700 dark:border-t-emerald-400" />
          <p className="font-semibold text-slate-700 dark:text-slate-200">Carregando balanço financeiro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="hero-panel p-6 sm:p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-sky-50">
            <Wallet className="h-3.5 w-3.5" />
            Visão financeira
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Caixa da clínica com leitura mais clara e ação mais rápida.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-50/85 sm:text-base">
            Monitore entradas, pendências e faturamento total em um painel com contraste mais confortável e foco no que pede decisão.
          </p>
        </div>

        <div className="surface-card flex flex-col justify-between p-6">
          <div>
            <p className="eyebrow mb-3">Período atual</p>
            <h2 className="font-display text-2xl font-extrabold text-slate-950 dark:text-slate-50 capitalize">
              {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Use os lançamentos recentes para acompanhar recebimentos confirmados e cobranças ainda pendentes.
            </p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="primary-button mt-5">
            <Plus className="h-4 w-4" />
            Novo lançamento
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FinancialCard
          icon={TrendingUp}
          label="Total recebido"
          value={`R$ ${stats.totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          footer="Saldo consolidado"
          footerIcon={ArrowUpRight}
          accent="bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300"
        />
        <FinancialCard
          icon={AlertCircle}
          label="A receber"
          value={`R$ ${stats.aReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          footer="Aguardando pagamento"
          footerIcon={Clock}
          accent="bg-amber-500/12 text-amber-700 dark:bg-amber-400/12 dark:text-amber-300"
        />
        <FinancialCard
          icon={DollarSign}
          label="Faturamento total"
          value={`R$ ${stats.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          footer="Acumulado no mês"
          footerIcon={Calendar}
          accent="bg-sky-500/12 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300"
        />
      </section>

      <section className="table-shell">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5 dark:border-slate-800">
          <div>
            <p className="eyebrow mb-2">Movimentações</p>
            <h3 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Últimos lançamentos</h3>
          </div>
          <button className="ghost-button px-0 py-0 text-sky-600 dark:text-sky-300">Exportar relatório</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="table-head">
              <tr className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Paciente / origem</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Forma</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {transacoes.length > 0 ? (
                transacoes.map((transaction) => (
                  <tr key={transaction.id} className="table-row">
                    <td className="px-6 py-4">
                      <span
                        className={`status-chip ${
                          transaction.status === 'pago'
                            ? 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300'
                            : 'bg-amber-500/12 text-amber-700 dark:bg-amber-400/12 dark:text-amber-300'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {transaction.paciente?.nome || 'Lançamento avulso'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Ref. #{transaction.agendamento_id || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {format(new Date(transaction.created_at || new Date()), 'dd/MM/yyyy')} às{' '}
                      {format(new Date(transaction.created_at || new Date()), 'HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span className="capitalize">{transaction.forma_pagamento || transaction.metodo_pagamento}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-display text-lg font-extrabold text-slate-950 dark:text-slate-50">
                        R$ {Number(transaction.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200/60 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                        <DollarSign className="h-7 w-7" />
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">Nenhuma movimentação financeira encontrada.</p>
                      <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Registre um lançamento para começar a acompanhar a saúde financeira da clínica.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <PaymentFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadFinanceiro} />
    </div>
  );
}

function FinancialCard({
  icon: Icon,
  label,
  value,
  footer,
  footerIcon: FooterIcon,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  footer: string;
  footerIcon: any;
  accent: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
            {value}
          </h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-[20px] ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        <FooterIcon className="h-3.5 w-3.5" />
        {footer}
      </div>
    </div>
  );
}
