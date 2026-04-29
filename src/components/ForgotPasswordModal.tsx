import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { Loader2, Mail, X } from 'lucide-react';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  if (!isOpen) return null;

  async function handleSendEmail(data: ForgotPasswordFormValues) {
    try {
      setIsSubmitting(true);
      await api.post('/password/forgot', { email: data.email });
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao enviar e-mail. Verifique o endereço digitado.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    reset();
    setIsSuccess(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay escuro */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity dark:bg-slate-950/60" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 sm:p-8">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recuperar Senha</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enviaremos um link de acesso</p>
          </div>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit(handleSendEmail)} className="space-y-4">
            <div>
              <label className="form-label">Seu e-mail cadastrado</label>
              <input
                {...register('email')}
                type="email"
                placeholder="exemplo@clinica.com.br"
                className="input-shell"
                autoFocus
              />
              {errors.email && <span className="helper-text text-red-500">{errors.email.message}</span>}
            </div>

            <button type="submit" disabled={isSubmitting} className="primary-button w-full mt-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">E-mail enviado! 🚀</h4>
            <p className="text-slate-600 dark:text-slate-400">
              Verifique sua caixa de entrada (e a pasta de spam). O link de recuperação expira em algumas horas.
            </p>
            <button onClick={handleClose} className="secondary-button w-full mt-6">
              Voltar ao Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
