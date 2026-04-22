import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { X, Loader2, User, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  async function handleCreatePatient(data: PatientFormValues) {
    try {
      setIsSubmitting(true);
      await api.post('/pacientes', {
        nome: data.nome,
        cpf: data.cpf,
        contato_whatsapp: data.telefone,
        convenio_nome: data.convenio,
        clinica_id: user?.clinica_id,
      });

      toast.success('Paciente cadastrado com sucesso!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao cadastrar paciente');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop justify-end">
      <div className="modal-card flex h-full w-full max-w-lg flex-col">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-slate-950 dark:text-slate-50">Novo paciente</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cadastre dados essenciais para abrir o prontuário.</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-button h-10 w-10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleCreatePatient)} className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <label className="form-label">Nome completo</label>
            <input {...register('nome')} placeholder="Ex: Maria Oliveira" className="input-shell" />
            {errors.nome && <p className="helper-text text-red-500">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="form-label">CPF</label>
            <input {...register('cpf')} maxLength={11} placeholder="Apenas números" className="input-shell" />
            {errors.cpf && <p className="helper-text text-red-500">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="form-label">Telefone / WhatsApp</label>
            <input {...register('telefone')} placeholder="(85) 99999-9999" className="input-shell" />
            {errors.telefone && <p className="helper-text text-red-500">{errors.telefone.message}</p>}
          </div>

          <div>
            <label className="form-label">Convênio</label>
            <input
              {...register('convenio')}
              placeholder="Ex: Unimed, Bradesco ou Particular"
              className="input-shell"
            />
            <p className="helper-text">Deixe em branco para atendimento particular.</p>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="secondary-button flex-1">
            Cancelar
          </button>
          <button onClick={handleSubmit(handleCreatePatient)} disabled={isSubmitting} className="primary-button flex-1">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Salvar paciente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
