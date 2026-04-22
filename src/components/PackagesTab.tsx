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
    (p) => p.status_pagamento === 'pago' && p.sessoes_restantes > 0 && !isPast(new Date(p.data_validade))
  );

  const statusConfig = {
    pago: { label: 'Pago', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    pendente: { label: 'Pendente', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    cancelado: { label: 'Cancelado', icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-100' },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-slate-400 animate-pulse font-medium">
        Carregando pacotes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          Pacotes de Sessões
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Pacote
        </button>
      </div>

      {/* CARD DO PACOTE ATIVO */}
      {pacoteAtivo ? (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-200" />
                <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Pacote Ativo</span>
              </div>
              <p className="text-3xl font-black">
                {pacoteAtivo.sessoes_restantes}
                <span className="text-blue-300 text-xl font-medium"> / {pacoteAtivo.sessoes_total} sessões</span>
              </p>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              {Math.round((pacoteAtivo.sessoes_restantes / pacoteAtivo.sessoes_total) * 100)}% restante
            </span>
          </div>

          {/* BARRA DE PROGRESSO */}
          <div className="w-full bg-white/20 rounded-full h-2.5 mb-4">
            <div
              className="bg-white rounded-full h-2.5 transition-all duration-500"
              style={{ width: `${(pacoteAtivo.sessoes_restantes / pacoteAtivo.sessoes_total) * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-4 text-blue-200 text-xs font-medium">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              Comprado em {format(new Date(pacoteAtivo.data_compra), "dd/MM/yyyy", { locale: ptBR })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Válido até {format(new Date(pacoteAtivo.data_validade), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Layers className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-amber-800 text-sm">Nenhum pacote ativo</p>
            <p className="text-amber-600 text-xs mt-0.5">
              A próxima sessão realizada gerará uma cobrança avulsa automaticamente.
            </p>
          </div>
        </div>
      )}

      {/* HISTÓRICO DE PACOTES */}
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
          Histórico de Pacotes
        </h4>

        {pacotes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-400 flex flex-col items-center gap-3">
            <Layers className="w-10 h-10 text-slate-200" />
            <p className="font-medium text-sm">Nenhum pacote registado para este paciente.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-bold text-sm hover:underline">
              Ativar primeiro pacote
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pacotes.map((pacote) => {
              const cfg = statusConfig[pacote.status_pagamento];
              const StatusIcon = cfg.icon;
              const expirado = isPast(new Date(pacote.data_validade)) && pacote.status_pagamento === 'pago';
              const sessoesConcluidas = pacote.sessoes_total - pacote.sessoes_restantes;

              return (
                <div
                  key={pacote.id}
                  className={`bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 ${
                    expirado ? 'opacity-60' : ''
                  }`}
                >
                  {/* Ícone de status */}
                  <div className={`p-2 rounded-lg shrink-0 ${cfg.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 text-sm">
                        {pacote.sessoes_total} sessões
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        {expirado ? 'Expirado' : cfg.label}
                      </span>
                    </div>
                    {/* Mini barra de progresso */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 rounded-full h-1.5 transition-all"
                          style={{ width: `${(sessoesConcluidas / pacote.sessoes_total) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {sessoesConcluidas}/{pacote.sessoes_total} usadas
                      </span>
                    </div>
                  </div>

                  {/* Datas */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-xs text-slate-500">
                      {format(new Date(pacote.data_compra), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      até {format(new Date(pacote.data_validade), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE NOVO PACOTE */}
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
