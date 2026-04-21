import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Save, Clipboard, Activity, Stethoscope, HeartPulse } from 'lucide-react';
import { toast } from 'sonner';

interface AnamneseProps {
  pacienteId: string;
}

export function AnamneseForm({ pacienteId }: AnamneseProps) {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    queixa_principal: '',
    hda: '', // Histórico da Doença Atual
    hpp: '', // Histórico Patológico Pregresso
    medicacoes: '',
    exame_fisico: '',
    objetivos_tratamento: '',
    conduta_inicial: ''
  });

  // Carrega os dados se já existirem no banco
  useEffect(() => {
    async function loadAnamnese() {
      try {
        const response = await api.get(`/pacientes/${pacienteId}/anamnese`);
        if (response.data) {
          setFormData(response.data);
        }
      } catch (err) {
        // Se der 404, apenas ignoramos pois é o primeiro preenchimento
        console.log("Anamnese não encontrada, iniciando formulário limpo.");
      } finally {
        setLoading(false);
      }
    }
    loadAnamnese();
  }, [pacienteId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post(`/pacientes/${pacienteId}/anamnese`, formData);
      toast.success('Anamnese salva com sucesso!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao salvar anamnese');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-center p-10 text-slate-400">Carregando ficha de avaliação...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-500">
      
      {/* SEÇÃO: HISTÓRICO CLÍNICO */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <Clipboard className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800">Histórico Clínico</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Queixa Principal</label>
            <textarea 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
              placeholder="O que trouxe o paciente à clínica?"
              value={formData.queixa_principal}
              onChange={e => setFormData({...formData, queixa_principal: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">H.D.A (História da Doença Atual)</label>
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                placeholder="Início dos sintomas, evolução, fatores de melhora/piora..."
                value={formData.hda}
                onChange={e => setFormData({...formData, hda: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">H.P.P (História Patológica Pregressa)</label>
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                placeholder="Cirurgias, fraturas, doenças crônicas, traumas..."
                value={formData.hpp}
                onChange={e => setFormData({...formData, hpp: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
              <HeartPulse className="w-3 h-3" /> Medicações em uso
            </label>
            <input 
              type="text"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Liste os remédios que o paciente toma"
              value={formData.medicacoes}
              onChange={e => setFormData({...formData, medicacoes: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* SEÇÃO: EXAME FÍSICO E CONDUTA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800">Avaliação Física e Conduta</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Exame Físico (Inspeção/Palpação/Testes)</label>
            <textarea 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
              placeholder="Postura, amplitude de movimento, força manual, testes ortopédicos específicos..."
              value={formData.exame_fisico}
              onChange={e => setFormData({...formData, exame_fisico: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Objetivos do Tratamento</label>
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                placeholder="Ex: Reduzir dor na escala visual analógica para 2 em 4 semanas..."
                value={formData.objetivos_tratamento}
                onChange={e => setFormData({...formData, objetivos_tratamento: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Conduta Inicial</label>
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                placeholder="Técnicas e recursos que serão utilizados..."
                value={formData.conduta_inicial}
                onChange={e => setFormData({...formData, conduta_inicial: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTÃO SALVAR FIXO/BOTTOM */}
      <div className="flex justify-end pb-10">
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : (
            <>
              <Save className="w-5 h-5" /> Salvar Ficha de Anamnese
            </>
          )}
        </button>
      </div>
    </form>
  );
}