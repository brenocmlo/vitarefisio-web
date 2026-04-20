import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { X, Loader2, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const evolutionSchema = z.object({
  descricao: z.string().min(10, 'A evolução deve ser mais detalhada (mín. 10 caracteres)'),
  data_sessao: z.string().nonempty('A data da sessão é obrigatória'),
});

type EvolutionFormValues = z.infer<typeof evolutionSchema>;

interface Props {
  isOpen: boolean;
  patientId: string | number;
  onClose: () => void;
  onSuccess: () => void;
}

export function EvolutionFormModal({ isOpen, patientId, onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EvolutionFormValues>({
    resolver: zodResolver(evolutionSchema),
    defaultValues: {
      data_sessao: new Date().toISOString().split('T')[0] // Data de hoje por padrão
    }
  });

  if (!isOpen) return null;

  async function handleCreateEvolution(data: EvolutionFormValues) {
    try {
      setIsSubmitting(true);
      // Rota do seu backend: POST /pacientes/:id/evolucoes
      await api.post(`/pacientes/${patientId}/evolucoes`, data);
      
      toast.success('Evolução registrada com sucesso!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Erro ao salvar evolução.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-blue-600" />
            Nova Evolução Clínica
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleCreateEvolution)} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data da Sessão</label>
            <input 
              type="date"
              {...register('data_sessao')}
              className="w-full md:w-1/3 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Relato da Evolução</label>
            <textarea 
              {...register('descricao')}
              rows={8}
              placeholder="Descreva aqui os procedimentos realizados, resposta do paciente, testes aplicados e plano para a próxima sessão..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
            {errors.descricao && <p className="text-xs text-red-500 mt-1">{errors.descricao.message}</p>}
          </div>

          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3">
            <div className="w-1 bg-amber-400 rounded-full"></div>
            <p className="text-xs text-amber-700">
              <strong>Nota importante:</strong> Este registro poderá ser editado por até 24 horas. Após esse período, ele será selado no prontuário eletrônico para fins legais.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalizar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}