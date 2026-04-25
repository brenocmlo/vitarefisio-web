import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { ArrowLeft, ArrowRight, Loader2, Mail, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function handleSendEmail(data: ForgotPasswordFormValues) {
    try {
      setIsSubmitting(true);
      await api.post('/password/forgot', { email: data.email });
      setIsSent(true);
      toast.success('E-mail de recuperação enviado!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao processar solicitação.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      {/* BACKGROUND ELEMENTS */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/10" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-lg items-center justify-center">
        <div className="surface-panel w-full p-8 sm:p-10">
          
          <div className="absolute right-8 top-8">
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="icon-button"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="mb-8">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
              <Mail className="h-7 w-7" />
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
              Recuperar senha
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {isSent 
                ? 'Enviamos as instruções de recuperação para o seu e-mail.' 
                : 'Insira seu e-mail cadastrado e enviaremos um link para você redefinir sua senha.'}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit(handleSendEmail)} className="space-y-5">
              <div>
                <label className="form-label">E-mail</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="voce@clinica.com"
                  className="input-shell"
                />
                {errors.email && <span className="helper-text text-red-500">{errors.email.message}</span>}
              </div>

              <button type="submit" disabled={isSubmitting} className="primary-button w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar link de recuperação
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Não recebeu o e-mail? Verifique sua caixa de spam ou tente novamente.
              </p>
              <button onClick={() => setIsSent(false)} className="secondary-button w-full">
                Tentar outro e-mail
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
