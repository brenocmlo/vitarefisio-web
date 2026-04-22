import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { History, Plus, Lock, Clock, Calendar, CheckCircle2, Layers, Paperclip, ClipboardList } from 'lucide-react';
import { format, isAfter, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EvolutionFormModal } from '../components/EvolutionFormModal';
import { AnamneseForm } from '../components/AnamneseForm';
import { PackagesTab } from '../components/PackagesTab';
import { AttachmentsTab } from '../components/AttachmentsTab';

const tabs = [
  { key: 'anamnese', label: 'Anamnese', icon: ClipboardList },
  { key: 'evolucoes', label: 'Evoluções', icon: History },
  { key: 'pacotes', label: 'Pacotes', icon: Layers },
  { key: 'anexos', label: 'Anexos', icon: Paperclip },
] as const;

export function MedicalRecord() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [evolutions, setEvolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['key']>('anamnese');

  async function loadData() {
    try {
      setLoading(true);
      const [patientRes, evolutionsRes] = await Promise.all([
        api.get(`/pacientes/${id}`),
        api.get(`/pacientes/${id}/evolucoes`),
      ]);
      setPatient(patientRes.data);
      setEvolutions(evolutionsRes.data);
    } catch (err) {
      console.error('Erro ao carregar prontuário', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="surface-panel flex min-h-[280px] items-center justify-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Carregando prontuário eletrônico...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="surface-panel overflow-hidden">
        <div className="hero-panel rounded-none border-0 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow mb-3 text-sky-100">Prontuário eletrônico</p>
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{patient?.nome}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-50/85">
                Centralize avaliação inicial, evoluções, pacotes e documentos do paciente com um fluxo clínico mais agradável de navegar.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <RecordPill label="CPF" value={patient?.cpf || '—'} />
              <RecordPill label="Convênio" value={patient?.convenio_nome || patient?.convenio || 'Particular'} />
            </div>
          </div>
        </div>
      </section>

      <section className="surface-panel p-3">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-[22px] px-4 py-3 text-left transition-all ${
                  active
                    ? 'bg-sky-500 text-white shadow-[0_16px_32px_rgba(14,165,233,0.22)]'
                    : 'text-slate-500 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-900/60'
                }`}
              >
                <span className="mb-2 flex items-center gap-2 font-bold">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </span>
                <span className={`text-xs ${active ? 'text-sky-50/85' : 'text-slate-400 dark:text-slate-500'}`}>
                  {tab.key === 'anamnese' && 'Ficha de avaliação inicial'}
                  {tab.key === 'evolucoes' && 'Histórico clínico cronológico'}
                  {tab.key === 'pacotes' && 'Controle de sessões contratadas'}
                  {tab.key === 'anexos' && 'Exames, laudos e documentos'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {activeTab === 'anamnese' && id && <AnamneseForm pacienteId={id} />}

      {activeTab === 'evolucoes' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow mb-2">Linha do tempo</p>
              <h3 className="font-display text-2xl font-extrabold text-slate-950 dark:text-slate-50">Histórico de evoluções</h3>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="primary-button">
              <Plus className="h-4 w-4" />
              Nova evolução
            </button>
          </div>

          {evolutions.length === 0 ? (
            <div className="surface-panel flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <History className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-800 dark:text-slate-100">Nenhum registro clínico encontrado.</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Crie a primeira evolução para iniciar a linha do tempo terapêutica deste paciente.
              </p>
              <button onClick={() => setIsModalOpen(true)} className="ghost-button mt-4 text-sky-600 dark:text-sky-300">
                Registrar primeira evolução
              </button>
            </div>
          ) : (
            <div className="relative space-y-4 before:absolute before:left-5 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent dark:before:via-slate-700">
              {evolutions.map((evolution) => {
                const createdAt = new Date(evolution.data_criacao || evolution.created_at || new Date());
                const isLocked = isAfter(new Date(), addHours(createdAt, 24));

                return (
                  <div key={evolution.id} className="relative flex gap-4 pl-14">
                    <div className="absolute left-0 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_16px_32px_rgba(14,165,233,0.22)]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>

                    <div className="surface-panel w-full overflow-hidden">
                      <div className="flex flex-col gap-3 border-b border-slate-200/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <Calendar className="h-4 w-4 text-sky-500" />
                          {format(createdAt, "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                        </div>
                        {evolution.finalizada ? (
                          <span className="status-chip chip-neutral">
                            <Lock className="h-3.5 w-3.5" />
                            Assinada
                          </span>
                        ) : isLocked ? (
                          <span className="status-chip bg-amber-500/12 text-amber-700 dark:bg-amber-400/12 dark:text-amber-300">
                            <Lock className="h-3.5 w-3.5" />
                            Expirada (24h)
                          </span>
                        ) : (
                          <span className="status-chip bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300">
                            <Clock className="h-3.5 w-3.5" />
                            Editável
                          </span>
                        )}
                      </div>

                      <div className="grid gap-4 p-5 lg:grid-cols-2">
                        {evolution.subjetivo && <SoapBlock color="bg-sky-500" title="Subjetivo" text={evolution.subjetivo} />}
                        {evolution.objetivo && <SoapBlock color="bg-emerald-500" title="Objetivo" text={evolution.objetivo} />}
                        {evolution.avaliacao && <SoapBlock color="bg-amber-500" title="Avaliação" text={evolution.avaliacao} />}
                        {evolution.plano && <SoapBlock color="bg-violet-500" title="Plano" text={evolution.plano} />}
                        {evolution.descricao && !evolution.subjetivo && (
                          <SoapBlock color="bg-slate-500" title="Registro legado" text={evolution.descricao} className="lg:col-span-2" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pacotes' && id && <PackagesTab pacienteId={id} pacienteNome={patient?.nome} />}

      {activeTab === 'anexos' && id && <AttachmentsTab pacienteId={id} />}

      <EvolutionFormModal
        isOpen={isModalOpen}
        patientId={id!}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

function RecordPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/14 bg-white/10 px-5 py-4 text-white backdrop-blur-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-100">{label}</p>
      <p className="mt-2 text-lg font-bold">{value}</p>
    </div>
  );
}

function SoapBlock({
  color,
  title,
  text,
  className = '',
}: {
  color: string;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={`surface-muted p-4 ${className}`}>
      <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        {title}
      </h4>
      <p className="text-sm leading-7 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{text}</p>
    </div>
  );
}
