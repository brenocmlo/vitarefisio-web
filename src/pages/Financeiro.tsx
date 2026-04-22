import { useState, useEffect, useMemo } from 'react';
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
  Download,
  Filter,
  CheckCircle2,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subDays, isAfter, addMonths, subMonths, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { PaymentFormModal } from '../components/PaymentFormModal';

export function Financeiro() {
  const [rawTransacoes, setRawTransacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [period, setPeriod] = useState<'7d' | '30d' | 'mes' | 'all' | 'mes-especifico'>('mes');
  const [deletingPaymentId, setDeletingPaymentId] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const periodOptions = [
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: 'mes', label: 'Este mês' },
    { value: 'mes-especifico', label: 'Mês específico' },
    { value: 'all', label: 'Tudo' },
  ] as const;

  function navigateMonth(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      setCurrentMonth(prev => subMonths(prev, 1));
    } else {
      setCurrentMonth(prev => addMonths(prev, 1));
    }
    setPeriod('mes-especifico');
  }

  function goToCurrentMonth() {
    setCurrentMonth(new Date());
    setPeriod('mes');
  }

  const availableMonths = useMemo(() => {
    const months = [];
    const currentDate = new Date();

    // Gera últimos 24 meses
    for (let i = 0; i < 24; i++) {
      const date = subMonths(currentDate, i);
      months.push({
        date,
        label: format(date, 'MMMM yyyy', { locale: ptBR }),
        value: format(date, 'yyyy-MM'),
      });
    }
    return months;
  }, []);

  function selectMonth(monthValue: string) {
    const [year, month] = monthValue.split('-').map(Number);
    setCurrentMonth(new Date(year, month - 1, 1));
    setPeriod('mes-especifico');
    setShowMonthPicker(false);
  }

  async function loadFinanceiro() {
    try {
      setLoading(true);
      const response = await api.get('/pagamentos');

      if (response.data.stats) {
        setRawTransacoes(response.data.recentes || []);
      } else {
        setRawTransacoes(response.data);
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

  useEffect(() => {
    function handleOutsideClick() {
      setShowMonthPicker(false);
    }

    if (showMonthPicker) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showMonthPicker]);

  const transacoes = useMemo(() => {
    const now = new Date();

    return rawTransacoes.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at || transaction.data_pagamento || new Date());

      if (period === 'all') return true;
      if (period === '7d') return isAfter(transactionDate, subDays(now, 7));
      if (period === '30d') return isAfter(transactionDate, subDays(now, 30));
      if (period === 'mes') return isAfter(transactionDate, startOfMonth(now));
      if (period === 'mes-especifico') {
        return isSameMonth(transactionDate, currentMonth);
      }
      return isAfter(transactionDate, startOfMonth(now));
    });
  }, [period, rawTransacoes, currentMonth]);

  const stats = useMemo(() => {
    return transacoes.reduce(
      (acc, transaction) => {
        const value = Number(transaction.valor || 0);
        acc.faturamentoMes += value;
        if (transaction.status === 'pago') {
          acc.totalRecebido += value;
        } else {
          acc.aReceber += value;
        }
        return acc;
      },
      {
        totalRecebido: 0,
        aReceber: 0,
        faturamentoMes: 0,
      }
    );
  }, [transacoes]);

  const currentPeriodLabel = useMemo(() => {
    if (period === '7d') return 'Últimos 7 dias';
    if (period === '30d') return 'Últimos 30 dias';
    if (period === 'all') return 'Período completo';
    if (period === 'mes-especifico') return format(currentMonth, 'MMMM yyyy', { locale: ptBR });
    return format(new Date(), 'MMMM yyyy', { locale: ptBR });
  }, [period, currentMonth]);

  async function handleDeletePayment(transaction: any) {
    const confirmed = window.confirm(
      `Deseja remover o lançamento de R$ ${Number(transaction.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de ${transaction.paciente?.nome || 'Lançamento avulso'}? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    try {
      setDeletingPaymentId(transaction.id);
      await api.delete(`/pagamentos/${transaction.id}`);
      setRawTransacoes((prev) => prev.filter((item) => item.id !== transaction.id));
      toast.success('Lançamento removido com sucesso.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || 'Não foi possível remover o lançamento.');
    } finally {
      setDeletingPaymentId(null);
    }
  }

  function handleExportReport() {
    if (transacoes.length === 0) {
      toast.error('Não há lançamentos no período selecionado para exportar.');
      return;
    }

    const header = ['status', 'paciente', 'data', 'forma_pagamento', 'valor', 'agendamento_id'];
    const lines = transacoes.map((transaction) => [
      transaction.status || '',
      transaction.paciente?.nome || 'Lançamento avulso',
      format(new Date(transaction.created_at || new Date()), 'dd/MM/yyyy HH:mm'),
      transaction.forma_pagamento || transaction.metodo_pagamento || '',
      Number(transaction.valor || 0).toFixed(2),
      transaction.agendamento_id || 'N/A',
    ]);

    const csvContent = [header, ...lines]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-financeiro-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Relatório exportado com sucesso.');
  }

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
              {currentPeriodLabel}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Use os lançamentos recentes para acompanhar recebimentos confirmados e cobranças ainda pendentes.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPeriod(option.value)}
                className={`rounded-2xl px-3 py-2 text-xs font-bold transition-all ${
                  period === option.value
                    ? 'bg-sky-500 text-white shadow-[0_12px_24px_rgba(14,165,233,0.22)]'
                    : 'surface-muted text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5" />
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {period === 'mes-especifico' && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-center gap-3 rounded-2xl bg-sky-500/10 p-3 dark:bg-sky-400/10">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-sky-600 transition-all hover:bg-white dark:bg-slate-800 dark:text-sky-400 dark:hover:bg-slate-700"
                  title="Mês anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 transition-all hover:bg-white dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
                  title="Selecionar mês"
                >
                  <Calendar className="h-4 w-4" />
                  {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </button>

                <button
                  onClick={() => navigateMonth('next')}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-sky-600 transition-all hover:bg-white dark:bg-slate-800 dark:text-sky-400 dark:hover:bg-slate-700"
                  title="Próximo mês"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={goToCurrentMonth}
                  className="ml-2 rounded-lg bg-sky-500 px-3 py-1 text-xs font-bold text-white transition-all hover:bg-sky-600"
                  title="Ir para mês atual"
                >
                  Hoje
                </button>
              </div>

              {showMonthPicker && (
                <div className="absolute z-10 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Selecionar período
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {availableMonths.slice(0, 12).map((month) => (
                      <button
                        key={month.value}
                        onClick={() => selectMonth(month.value)}
                        className={`rounded-lg p-2 text-xs transition-all hover:bg-sky-500 hover:text-white ${
                          isSameMonth(month.date, currentMonth)
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {format(month.date, 'MMM yy', { locale: ptBR })}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => setShowMonthPicker(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
        <div className="flex flex-col gap-3 border-b border-slate-200/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div>
            <p className="eyebrow mb-2">Movimentações</p>
            <h3 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Últimos lançamentos</h3>
          </div>
          <button onClick={handleExportReport} className="ghost-button px-0 py-0 text-sky-600 dark:text-sky-300">
            <Download className="h-4 w-4" />
            Exportar relatório
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="table-head">
              <tr className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Paciente / origem</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Forma</th>
                <th className="px-6 py-4">Sessão paga?</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Ações</th>
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
                    <td className="px-6 py-4">
                      <span className={transaction.status === 'pago' ? 'chip-success' : 'chip-warning'}>
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        {transaction.status === 'pago' ? 'Confirmado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-display text-lg font-extrabold text-slate-950 dark:text-slate-50">
                        R$ {Number(transaction.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeletePayment(transaction)}
                        disabled={deletingPaymentId === transaction.id}
                        className="inline-flex items-center justify-center gap-2 rounded-lg p-2 text-red-600 transition-all hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400"
                        title="Remover lançamento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
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
