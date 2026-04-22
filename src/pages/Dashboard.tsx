import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import {
  Users,
  Calendar as CalendarIcon,
  TrendingUp,
  UserX,
  Clock,
  ExternalLink,
  UserPlus,
  CalendarPlus,
  DollarSign,
  ArrowRight,
  Activity,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { PatientFormModal } from '../components/PatientFormModal';
import { AppointmentFormModal } from '../components/AppointmentFormModal';

interface Metrics {
  hoje: {
    total_agendamentos: number;
    proximos_pacientes: any[];
  };
  mes: {
    pacientes_ativos: number;
    sessoes_realizadas: number;
    taxa_de_faltas_percentual: string | number;
    faturamento_estimado: number;
  };
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await api.get(`/dashboard?clinica_id=${user?.clinica_id}`);
        setMetrics(response.data);
      } catch (error) {
        console.error('Erro ao carregar dashboard', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user?.clinica_id]);

  const stats = useMemo(
    () => [
      {
        title: 'Pacientes ativos',
        value: metrics?.mes.pacientes_ativos || 0,
        icon: Users,
        accent: 'bg-sky-500/12 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300',
      },
      {
        title: 'Agendamentos hoje',
        value: metrics?.hoje.total_agendamentos || 0,
        icon: CalendarIcon,
        accent: 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300',
      },
      {
        title: 'Faturamento do mês',
        value: currencyFormatter.format(metrics?.mes.faturamento_estimado || 0),
        icon: TrendingUp,
        accent: 'bg-violet-500/12 text-violet-700 dark:bg-violet-400/12 dark:text-violet-300',
      },
      {
        title: 'Taxa de faltas',
        value: `${metrics?.mes.taxa_de_faltas_percentual || 0}%`,
        icon: UserX,
        accent: 'bg-amber-500/12 text-amber-700 dark:bg-amber-400/12 dark:text-amber-300',
      },
    ],
    [metrics]
  );

  if (loading) {
    return (
      <div className="surface-panel flex min-h-[260px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-400" />
          <p className="font-semibold text-slate-700 dark:text-slate-200">Carregando métricas da clínica...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="hero-panel relative overflow-hidden p-5 sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-50 sm:px-4 sm:text-xs sm:tracking-[0.22em]">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="truncate">{format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}</span>
            </div>
            <h1 className="font-display max-w-2xl text-2xl font-extrabold leading-tight sm:text-4xl">
              Olá, {user?.nome}. Seu panorama clínico está pronto para hoje.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-sky-50/90 sm:text-base sm:leading-7">
              Veja rapidamente o ritmo da agenda, o comportamento financeiro e os próximos atendimentos para manter o dia fluindo com mais clareza.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            <button onClick={() => setIsPatientModalOpen(true)} className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15">
              <UserPlus className="mb-3 h-5 w-5 text-sky-100" />
              <p className="font-semibold">Novo paciente</p>
              <p className="mt-1 text-sm text-sky-50/80">Cadastre e comece o acompanhamento.</p>
            </button>
            <button onClick={() => setIsAppointmentModalOpen(true)} className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15">
              <CalendarPlus className="mb-3 h-5 w-5 text-sky-100" />
              <p className="font-semibold">Novo agendamento</p>
              <p className="mt-1 text-sm text-sky-50/80">Abra um horário em poucos cliques.</p>
            </button>
            <button onClick={() => navigate('/financeiro')} className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15">
              <DollarSign className="mb-3 h-5 w-5 text-sky-100" />
              <p className="font-semibold">Lançar pagamento</p>
              <p className="mt-1 text-sm text-sky-50/80">Registre sessões avulsas ou pacotes.</p>
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <MetricCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-panel overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-200/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-700/80">
            <div>
              <p className="eyebrow mb-2">Atendimentos</p>
              <h3 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Próximos do dia</h3>
            </div>
            <button onClick={() => navigate('/agenda')} className="ghost-button px-0 py-0 text-sky-600 dark:text-sky-300">
              Ver agenda completa
            </button>
          </div>

          <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {metrics?.hoje.proximos_pacientes.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
                  <Clock className="h-7 w-7" />
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">Nenhum agendamento para o restante do dia.</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Aproveite para organizar prontuários pendentes ou abrir novos horários para encaixe.
                </p>
              </div>
            ) : (
              metrics?.hoje.proximos_pacientes.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-sky-500/[0.04] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-[22px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Hora</span>
                      <span className="text-sm font-extrabold">{format(new Date(item.data_hora), 'HH:mm')}</span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {item.paciente?.nome || `Paciente #${item.paciente_id}`}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Status atual: <span className="font-semibold capitalize text-slate-700 dark:text-slate-200">{item.status}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/pacientes/${item.paciente_id}/prontuario`)}
                    className="secondary-button justify-center sm:justify-start"
                  >
                    Abrir prontuário
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="surface-panel p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[22px] bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="eyebrow mb-1">Ritmo do mês</p>
                <h3 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Operação em movimento</h3>
              </div>
            </div>

            <div className="space-y-4">
              <InsightRow
                label="Sessões realizadas"
                value={String(metrics?.mes.sessoes_realizadas || 0)}
                description="Evoluções concluídas no mês corrente."
              />
              <InsightRow
                label="Receita estimada"
                value={currencyFormatter.format(metrics?.mes.faturamento_estimado || 0)}
                description="Baseada nos atendimentos já registrados."
              />
              <InsightRow
                label="Engajamento da agenda"
                value={`${metrics?.hoje.total_agendamentos || 0} slots`}
                description="Sessões já distribuídas ao longo do dia."
              />
            </div>
          </div>

          <div className="surface-card p-5 sm:p-6">
            <p className="eyebrow mb-3">Próximo passo</p>
            <h3 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">
              Quer acelerar o fluxo de trabalho?
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Mantenha o prontuário atualizado logo após cada consulta para reduzir retrabalho e ter indicadores mais confiáveis.
            </p>
            <button onClick={() => navigate('/pacientes')} className="primary-button mt-5">
              Ver pacientes
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={() => {
          setIsPatientModalOpen(false);
        }}
      />
      <AppointmentFormModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSuccess={() => {
          setIsAppointmentModalOpen(false);
        }}
        selectedDate={new Date()}
      />
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, accent }: any) {
  return (
    <div className="stat-card p-5 sm:p-6">
      <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-[var(--hero-glow)] blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl">
            {value}
          </h2>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-[20px] ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InsightRow({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="surface-muted p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <span className="text-sm font-extrabold text-sky-700 dark:text-sky-300 sm:text-right">{value}</span>
      </div>
    </div>
  );
}
