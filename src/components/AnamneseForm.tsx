import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Save, Clipboard, Activity, HeartPulse } from 'lucide-react';
import { toast } from 'sonner';

interface AnamneseProps {
  pacienteId: string;
}

export function AnamneseForm({ pacienteId }: AnamneseProps) {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    queixa_principal: '',
    hda: '',
    hpp: '',
    medicacoes: '',
    exame_fisico: '',
    objetivos_tratamento: '',
    conduta_inicial: '',
  });

  useEffect(() => {
    async function loadAnamnese() {
      try {
        const response = await api.get(`/pacientes/${pacienteId}/anamnese`);
        if (response.data) {
          setFormData(response.data);
        }
      } catch (err) {
        console.log('Anamnese não encontrada, iniciando formulário limpo.');
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

  if (loading) {
    return (
      <div className="surface-panel flex min-h-[220px] items-center justify-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Carregando ficha de avaliação...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="surface-panel overflow-hidden">
        <div className="border-b border-slate-200/70 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
              <Clipboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Histórico clínico</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Registre a queixa principal e o contexto do quadro atual.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-6">
          <div>
            <label className="form-label">Queixa principal</label>
            <textarea
              className="textarea-shell min-h-[120px]"
              placeholder="O que trouxe o paciente à clínica?"
              value={formData.queixa_principal}
              onChange={(e) => setFormData({ ...formData, queixa_principal: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="form-label">H.D.A</label>
              <textarea
                className="textarea-shell min-h-[150px]"
                placeholder="Início dos sintomas, evolução, fatores de melhora e piora..."
                value={formData.hda}
                onChange={(e) => setFormData({ ...formData, hda: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">H.P.P</label>
              <textarea
                className="textarea-shell min-h-[150px]"
                placeholder="Cirurgias, fraturas, doenças crônicas, traumas..."
                value={formData.hpp}
                onChange={(e) => setFormData({ ...formData, hpp: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="form-label flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-slate-400" />
              Medicações em uso
            </label>
            <input
              type="text"
              className="input-shell"
              placeholder="Liste os remédios que o paciente utiliza"
              value={formData.medicacoes}
              onChange={(e) => setFormData({ ...formData, medicacoes: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="surface-panel overflow-hidden">
        <div className="border-b border-slate-200/70 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Avaliação física e conduta</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Descreva exame físico, objetivos terapêuticos e plano inicial.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-6">
          <div>
            <label className="form-label">Exame físico</label>
            <textarea
              className="textarea-shell min-h-[160px]"
              placeholder="Postura, amplitude de movimento, força manual e testes específicos..."
              value={formData.exame_fisico}
              onChange={(e) => setFormData({ ...formData, exame_fisico: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="form-label">Objetivos do tratamento</label>
              <textarea
                className="textarea-shell min-h-[130px]"
                placeholder="Ex: reduzir dor para 2/10 em 4 semanas..."
                value={formData.objetivos_tratamento}
                onChange={(e) => setFormData({ ...formData, objetivos_tratamento: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Conduta inicial</label>
              <textarea
                className="textarea-shell min-h-[130px]"
                placeholder="Técnicas e recursos que serão utilizados..."
                value={formData.conduta_inicial}
                onChange={(e) => setFormData({ ...formData, conduta_inicial: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pb-6">
        <button type="submit" disabled={isSaving} className="primary-button">
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar ficha de anamnese'}
        </button>
      </div>
    </form>
  );
}
