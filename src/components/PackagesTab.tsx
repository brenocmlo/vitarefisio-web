import { useEffect, useState } from 'react';
import api from '../services/api';
import { Layers, CheckCircle2, Clock, XCircle, Plus, CalendarDays, Zap } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PaymentFormModal } from './PaymentFormModal';

interface Pacote {
  id: number;
  sessoes_total: number;
  sessoes_restantes: number;
  data_compra: string;
  data_validade: string;
  status_pagamento: 'pendente' | 'pago' | 'cancelado';
}

interface PackagesTabProps {
  pacienteId: string;
  pacienteNome?: string;
}

export function PackagesTab({ pacienteId, pacienteNome }: PackagesTabProps) {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadPacotes() {
    try {
      setLoading(true);
      const response = await api.get(`/pacientes/${pacienteId}/pacotes`);
      setPacotes(response.data);
    } catch (err) {
      console.error('Erro ao carregar pacotes', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPacotes();
  }, [pacienteId]);

  const pacoteAtivo = pacotes.find(
    (pacote) => pacote.status_pagamento === 'pago' && pacote.sessoes_restantes > 0 && !isPast(new Date(pacote.data_validade))
  );

  const statusConfig = {
    pago: { label: 'Pago', icon: CheckCircle2, color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-500/12 dark:bg-emerald-400/12' },
    pendente: { label: 'Pendente', icon: Clock, color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-500/12 dark:bg-amber-400/12' },
    cancelado: { label: 'Cancelado', icon: XCircle, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-200/70 dark:bg-slate-800' },
  };

  if (loading) {
    return (
      <div className="surface-panel flex min-h-[220px] items-center justify-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Carregando pacotes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Pacotes</p>
          <h3 className="font-display text-2xl font-extrabold text-slate-950 dark:text-slate-50">
            Sessões contratadas {pacienteNome ? `de ${pacienteNome}` : ''}
          </h3>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="primary-button">
          <Plus className="h-4 w-4" />
          Novo pacote
        </button>
      </div>

      {pacoteAtivo ? (
        <div className="hero-panel p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-sky-50">
                <Zap className="h-3.5 w-3.5" />
                Pacote ativo
              </div>
              <p className="font-display text-4xl font-extrabold">
                {pacoteAtivo.sessoes_restantes}
                <span className="ml-2 text-xl font-semibold text-sky-100/85">de {pacoteAtivo.sessoes_total} sessões restantes</span>
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/20 lg:w-80">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${(pacoteAtivo.sessoes_restantes / pacoteAtivo.sessoes_total) * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-sky-100/85">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Comprado em {format(new Date(pacoteAtivo.data_compra), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Válido até {format(new Date(pacoteAtivo.data_validade), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="surface-card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-amber-500/12 text-amber-700 dark:bg-amber-400/12 dark:text-amber-300">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">Nenhum pacote ativo</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              A próxima sessão realizada será tratada como cobrança avulsa.
            </p>
          </div>
        </div>
      )}

      <div>
        <p className="eyebrow mb-3">Histórico</p>
        {pacotes.length === 0 ? (
          <div className="surface-panel flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
            <Layers className="mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-slate-800 dark:text-slate-100">Nenhum pacote registrado.</p>
            <button onClick={() => setIsModalOpen(true)} className="ghost-button mt-4 text-sky-600 dark:text-sky-300">
              Ativar primeiro pacote
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pacotes.map((pacote) => {
              const config = statusConfig[pacote.status_pagamento];
              const StatusIcon = config.icon;
              const expirado = isPast(new Date(pacote.data_validade)) && pacote.status_pagamento === 'pago';
              const sessoesConcluidas = pacote.sessoes_total - pacote.sessoes_restantes;

              return (
                <div key={pacote.id} className={`surface-panel p-5 ${expirado ? 'opacity-70' : ''}`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-[18px] ${config.bg} ${config.color}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{pacote.sessoes_total} sessões</p>
                          <span className={`status-chip ${config.bg} ${config.color}`}>{expirado ? 'Expirado' : config.label}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {format(new Date(pacote.data_compra), 'dd/MM/yyyy', { locale: ptBR })} até{' '}
                          {format(new Date(pacote.data_validade), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                    </div>

                    <div className="w-full lg:w-72">
                      <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>Uso do pacote</span>
                        <span>
                          {sessoesConcluidas}/{pacote.sessoes_total}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-sky-500"
                          style={{ width: `${(sessoesConcluidas / pacote.sessoes_total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PaymentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          loadPacotes();
        }}
        defaultPacienteId={pacienteId}
        defaultIsPacote={true}
      />
    </div>
  );
}
