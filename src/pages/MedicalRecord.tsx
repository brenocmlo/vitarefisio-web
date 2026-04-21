import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { History, Plus, Lock, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { format, isAfter, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EvolutionFormModal } from '../components/EvolutionFormModal';
import { AnamneseForm } from '../components/AnamneseForm';

export function MedicalRecord() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [evolutions, setEvolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'anamnese' | 'evolucoes'>('anamnese');

  async function loadData() {
    try {
      setLoading(true);
      const [patientRes, evolutionsRes] = await Promise.all([
        api.get(`/pacientes/${id}`),
        api.get(`/pacientes/${id}/evolucoes`)
      ]);
      setPatient(patientRes.data);
      setEvolutions(evolutionsRes.data);
    } catch (err) {
      console.error("Erro ao carregar prontuário", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-slate-400 font-medium animate-pulse">
      Carregando prontuário eletrónico...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER DO PACIENTE */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center border-t-4 border-t-blue-600">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{patient?.nome}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-2 font-medium">
            <span className="bg-slate-100 px-3 py-1 rounded-md">CPF: {patient?.cpf}</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
              Convênio: {patient?.convenio || 'Particular'}
            </span>
          </div>
        </div>
      </div>
        
      {/* NAVEGAÇÃO POR ABAS */}
      <div className="flex border-b border-slate-200 gap-8 px-2">
        <button
          onClick={() => setActiveTab('anamnese')}
          className={`pb-4 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'anamnese' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Ficha de Anamnese (Avaliação)
        </button>
        <button
          onClick={() => setActiveTab('evolucoes')}
          className={`pb-4 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'evolucoes' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Histórico Clínico (Evoluções)
        </button>
      </div>

      {/* ABA: ANAMNESE */}
      {activeTab === 'anamnese' && id && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <AnamneseForm pacienteId={id} />
        </div>
      )}

      {/* ABA: EVOLUÇÕES (TIMELINE) */}
      {activeTab === 'evolucoes' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Linha do Tempo
            </h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nova Evolução
            </button>
          </div>

          {evolutions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400 flex flex-col items-center gap-3">
              <History className="w-12 h-12 text-slate-200" />
              <p className="font-medium">Nenhum registo clínico encontrado para este paciente.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-bold hover:underline">
                Clique aqui para registar a primeira evolução
              </button>
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {evolutions.map((evo) => {
                // Lógica de tempo corrigida para usar data_criacao e addHours
                const dataCriacao = new Date(evo.data_criacao || evo.created_at || new Date());
                const isLocked = isAfter(new Date(), addHours(dataCriacao, 24));
                
                return (
                  <div key={evo.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Ícone central da Timeline */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    
                    {/* Card de Conteúdo */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                      
                      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {format(dataCriacao, "dd 'de' MMM, yyyy", { locale: ptBR })}
                        </div>
                        
                        {/* Status de Segurança do Registo */}
                        {evo.finalizada ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded uppercase tracking-wider">
                            <Lock className="w-3 h-3" /> Assinada
                          </span>
                        ) : isLocked ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase tracking-wider">
                            <Lock className="w-3 h-3" /> Expirada (24h)
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">
                            <Clock className="w-3 h-3" /> Editável
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-4">
                        {/* MÉTODO SOAP ESTRUTURADO */}
                        {evo.subjetivo && (
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Subjetivo (Queixa)
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">{evo.subjetivo}</p>
                          </div>
                        )}
                        
                        {evo.objetivo && (
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Objetivo (Exame Físico)
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">{evo.objetivo}</p>
                          </div>
                        )}
                        
                        {evo.avaliacao && (
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Avaliação Clínica
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">{evo.avaliacao}</p>
                          </div>
                        )}
                        
                        {evo.plano && (
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Plano de Tratamento
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">{evo.plano}</p>
                          </div>
                        )}

                        {/* Fallback para Evoluções Antigas (Legado) */}
                        {evo.descricao && !evo.subjetivo && (
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Registo Legado
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{evo.descricao}</p>
                          </div>
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

      {/* MODAL PARA NOVA EVOLUÇÃO */}
      <EvolutionFormModal 
        isOpen={isModalOpen}
        patientId={id!}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}