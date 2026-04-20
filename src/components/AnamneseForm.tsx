import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

interface AnamneseFormValues {
  queixa_principal: string;
  historico_doenca_atual: string;
  historico_patologico_pregresso: string;
  medicamentos_em_uso: string;
  exames_complementares: string;
  observacoes: string;
}

interface Props {
  pacienteId: string;
}

export function AnamneseForm({ pacienteId }: Props) {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<AnamneseFormValues>();

  useEffect(() => {
    async function loadAnamnese() {
      try {
        setLoading(true);
        const response = await api.get(`/pacientes/${pacienteId}/anamnese`);
        if (response.data && Object.keys(response.data).length > 0) {
          reset(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar anamnese', error);
      } finally {
        setLoading(false);
      }
    }
    loadAnamnese();
  }, [pacienteId, reset]);

  async function handleSaveAnamnese(data: AnamneseFormValues) {
    try {
      setIsSubmitting(true);
      await api.post(`/pacientes/${pacienteId}/anamnese`, data);
      toast.success('Anamnese salva com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar anamnese');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Carregando anamnese...</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleSaveAnamnese)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Queixa Principal (QP)</label>
            <textarea
              {...register('queixa_principal')}
              rows={3}
              placeholder="Motivo principal da busca por atendimento..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">História da Doença Atual (HDA)</label>
            <textarea
              {...register('historico_doenca_atual')}
              rows={4}
              placeholder="Como e quando começou? Sintomas associados..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Histórico Patológico Pregresso (HPP)</label>
            <textarea
              {...register('historico_patologico_pregresso')}
              rows={3}
              placeholder="Cirurgias prévias, doenças crônicas (ex: HAS, DM)..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Medicamentos em Uso</label>
            <textarea
              {...register('medicamentos_em_uso')}
              rows={2}
              placeholder="Quais medicamentos o paciente utiliza regularmente?"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Exames Complementares</label>
        <textarea
          {...register('exames_complementares')}
          rows={2}
          placeholder="Ressonância, Raio-X, Ultrassom (Laudos e datas)..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Observações Adicionais</label>
        <textarea
          {...register('observacoes')}
          rows={2}
          placeholder="Estilo de vida, ergonomia no trabalho, etc..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors"
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar Anamnese
        </button>
      </div>
    </form>
  );
}
