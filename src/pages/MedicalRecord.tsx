import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { History, Plus, Lock, Clock, Calendar } from 'lucide-react';
import { format, isAfter, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EvolutionFormModal } from '../components/EvolutionFormModal'; // 1. Importe o Modal
import { AnamneseForm } from '../components/AnamneseForm';

export function MedicalRecord() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [evolutions, setEvolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 2. Estado para o Modal
  const [activeTab, setActiveTab] = useState<'anamnese' | 'evolucoes'>('anamnese');

  // Transformei o loadData em uma função externa ao useEffect para podermos chamá-la após o cadastro
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

  if (loading) return <div className="p-8">Carregando prontuário...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header do Paciente */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{patient?.nome}</h1>
          <div className="flex gap-4 text-sm text-slate-500 mt-1">
            <span>CPF: {patient?.cpf}</span>
            <span>•</span>
            <span>Convênio: {patient?.convenio || 'Particular'}</span>
          </div>
        </div>
      </div>
        
      {/* Navegação por Abas */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('anamnese')}
          className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'anamnese' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Ficha de Anamnese
        </button>
        <button
          onClick={() => setActiveTab('evolucoes')}
          className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'evolucoes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Histórico de Evoluções
        </button>
      </div>

      {activeTab === 'anamnese' && id && (
        <AnamneseForm pacienteId={id} />
      )}

      {/* Timeline de Evoluções */}
      {activeTab === 'evolucoes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Evoluções
            </h3>
            {/* 3. Botão agora abre o modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
            >
              <Plus className="w-4 h-4" />
              Nova Evolução
            </button>
          </div>

          {evolutions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-300 text-slate-400">
              Nenhum registro clínico encontrado para este paciente.
            </div>
          ) : (
            evolutions.map((evo) => {
              const isLocked = isAfter(new Date(), subHours(new Date(evo.created_at), -24));
              
              return (
                <div key={evo.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {format(new Date(evo.data_sessao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                    {isLocked ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded">
                        <Lock className="w-3 h-3" /> REGISTRO BLOQUEADO
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" /> EDITÁVEL (24H)
                      </span>
                    )}
                  </div>
                  <div className="p-5 text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {evo.descricao}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. Inclusão do Modal de Evolução */}
      <EvolutionFormModal 
        isOpen={isModalOpen}
        patientId={id!}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}