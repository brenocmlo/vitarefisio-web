import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { X, Loader2, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner'; // Se instalou o sonner, senão use alert

const patientSchema = z.object({
  nome: z.string().min(3, 'Nome obrigatório'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  telefone: z.string().min(10, 'Telefone inválido'),
  convenio: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PatientFormModal({ isOpen, onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
  });

  if (!isOpen) return null;

  async function handleCreatePatient(data: PatientFormValues) {
    try {
      setIsSubmitting(true);
      await api.post('/pacientes', {
        nome: data.nome,
        cpf: data.cpf,
        contato_whatsapp: data.telefone,
        convenio_nome: data.convenio,
        clinica_id: user?.clinica_id
      });
      
      toast.success('Paciente cadastrado com sucesso!');
      reset(); // Limpa o formulário
      onSuccess(); // Atualiza a lista na página pai
      onClose(); // Fecha o modal
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao cadastrar paciente');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header do Modal */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Novo Paciente
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(handleCreatePatient)} className="p-6 flex-1 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input 
              {...register('nome')}
              placeholder="Ex: Maria Oliveira"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CPF (apenas números)</label>
            <input 
              {...register('cpf')}
              maxLength={11}
              placeholder="000.000.000-00"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.cpf && <p className="text-xs text-red-500 mt-1">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
            <input 
              {...register('telefone')}
              placeholder="(85) 99999-9999"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Convênio (Opcional)</label>
            <input 
              {...register('convenio')}
              placeholder="Ex: Unimed, Bradesco ou Particular"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </form>

        {/* Footer do Modal */}
        <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit(handleCreatePatient)}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}