import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, Loader2, Moon, ShieldCheck, Sparkles, Stethoscope, Sun } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const highlights = [
  'Agenda terapêutica com encaixes e status em tempo real.',
  'Prontuário organizado com anamnese, evoluções e anexos.',
  'Visão financeira clara para sessões, pacotes e recebimentos.',
];

export function Login() {
  const { signIn } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(data: LoginFormValues) {
    try {
      setIsSubmitting(true);
      setError('');

      await signIn({
        email: data.email,
        senha: data.password,
      });

      navigate('/dashboard');
    } catch {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/10" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-stretch">
        <div className="surface-panel grid w-full overflow-hidden lg:grid-cols-[1.08fr_0.92fr]">
          <section className="hero-panel relative hidden flex-col justify-between p-8 lg:flex xl:p-10">
            <div className="absolute right-8 top-8">
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {resolvedTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              </button>
            </div>

            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/14 backdrop-blur-sm">
                <Stethoscope className="h-8 w-8" />
              </div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.32em] text-sky-100">VitareFisio</p>
              <h1 className="font-display max-w-xl text-4xl font-extrabold leading-tight xl:text-5xl">
                A rotina clínica com mais presença visual e menos ruído.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-sky-50/88">
                Centralize pacientes, agenda, evoluções e caixa em um painel elegante, legível e confortável para usar o dia inteiro.
              </p>
            </div>

            <div className="grid gap-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[22px] border border-white/14 bg-white/10 px-4 py-4 backdrop-blur-sm"
                >
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/16">
                    <Sparkles className="h-4 w-4 text-sky-100" />
                  </div>
                  <p className="text-sm leading-6 text-sky-50/92">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative flex items-center justify-center p-5 sm:p-8">
            <div className="absolute right-5 top-5 lg:hidden">
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="icon-button"
                aria-label="Alternar tema"
              >
                {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>

            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <p className="eyebrow mb-3">Acesso seguro</p>
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
                  Entrar na sua clínica
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Faça login para continuar com seus atendimentos, anotações e lançamentos financeiros.
                </p>
              </div>

              <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {error}
                  </div>
                )}

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

                <div>
                  <label className="form-label">Senha</label>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="input-shell"
                  />
                  {errors.password && <span className="helper-text text-red-500">{errors.password.message}</span>}
                </div>

                <button type="submit" disabled={isSubmitting} className="primary-button w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/70 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ainda não tem conta?{' '}
                  <Link to="/signup" className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200">
                    Cadastre-se como profissional autônomo
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
