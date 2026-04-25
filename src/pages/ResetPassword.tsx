import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { KeyRound, Loader2, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function handleResetPassword(data: ResetPasswordFormValues) {
    if (!token) {
      toast.error('Token de recuperação ausente.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/password/reset', { 
        token, 
        senha: data.password 
      });
      setIsSuccess(true);
      toast.success('Senha redefinida com sucesso!');
      
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao redefinir senha.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="surface-panel p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">Link Inválido</h2>
          <p className="mt-2 text-slate-500">Este link de recuperação parece estar quebrado ou expirado.</p>
          <button onClick={() => navigate('/')} className="primary-button mt-6 w-full">Voltar ao Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10" />

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
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300">
              <KeyRound className="h-7 w-7" />
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
              Nova senha
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Crie uma senha forte para proteger seu acesso à clínica.
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-5">
              <div>
                <label className="form-label">Nova Senha</label>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="No mínimo 6 caracteres"
                  className="input-shell"
                />
                {errors.password && <span className="helper-text text-red-500">{errors.password.message}</span>}
              </div>

              <div>
                <label className="form-label">Confirmar Senha</label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Repita a nova senha"
                  className="input-shell"
                />
                {errors.confirmPassword && <span className="helper-text text-red-500">{errors.confirmPassword.message}</span>}
              </div>

              <button type="submit" disabled={isSubmitting} className="primary-button w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  'Redefinir Senha'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sucesso!</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Sua senha foi atualizada. Você será redirecionado para o login em instantes...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
