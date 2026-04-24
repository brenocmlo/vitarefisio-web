import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { ArrowLeft, ArrowRight, Loader2, Moon, ShieldPlus, Sparkles, Sun, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const signupSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  cpf: z.string().length(11, 'O CPF deve ter 11 dígitos'),
  crefito: z.string().min(3, 'CREFITO obrigatório'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const benefits = [
  'Cadastro simples para começar a operar sem depender de configuração extensa.',
  'Visual confortável em light e dark mode para uso prolongado.',
  'Fluxos prontos para agenda, prontuário e financeiro desde o primeiro acesso.',
];

export function Signup() {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  async function handleSignup(data: SignupFormValues) {
    try {
      setIsSubmitting(true);
      setError('');

      await api.post('/signup/autonomo', data);

      alert('Cadastro realizado com sucesso! Faça seu login.');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao realizar cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-16 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-stretch">
        <div className="surface-panel grid w-full overflow-hidden lg:grid-cols-[0.96fr_1.04fr]">
          <section className="surface-muted hidden p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
                <UserPlus className="h-7 w-7" />
              </div>
              <p className="eyebrow mb-3">Primeiro acesso</p>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
                Monte sua base clínica com uma experiência mais refinada.
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-500 dark:text-slate-400">
                Cadastre seu perfil profissional e comece com uma interface pensada para rotina real de atendimento.
              </p>
            </div>

            <div className="grid gap-4">
              {benefits.map((item) => (
                <div key={item} className="rounded-[22px] border border-slate-200/80 bg-white/70 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/55">
                  <div className="mb-2 flex items-center gap-2 text-sky-600 dark:text-sky-300">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-extrabold uppercase tracking-[0.22em]">Benefício</span>
                  </div>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative flex items-center justify-center p-5 sm:p-8">
            <div className="absolute right-5 top-5 flex items-center gap-2">
              <Link to="/" className="icon-button" aria-label="Voltar">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="icon-button"
                aria-label="Alternar tema"
              >
                {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>

            <div className="w-full max-w-xl">
              <div className="mb-8">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300">
                  <ShieldPlus className="h-7 w-7" />
                </div>
                <p className="eyebrow mb-3">Criação de conta</p>
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
                  Seja SomosFisio
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Preencha seus dados profissionais para liberar agenda, prontuário e financeiro em um único painel.
                </p>
              </div>

              <form onSubmit={handleSubmit(handleSignup)} className="grid grid-cols-1 gap-4">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {error}
                  </div>
                )}

                <div>
                  <label className="form-label">Nome completo</label>
                  <input {...register('nome')} placeholder="Ex: Dra. Mariana Silva" className="input-shell" />
                  {errors.nome && <span className="helper-text text-red-500">{errors.nome.message}</span>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="form-label">CPF</label>
                    <input {...register('cpf')} maxLength={11} placeholder="Somente números" className="input-shell" />
                    {errors.cpf && <span className="helper-text text-red-500">{errors.cpf.message}</span>}
                  </div>
                  <div>
                    <label className="form-label">CREFITO</label>
                    <input {...register('crefito')} placeholder="Ex: 123456-F" className="input-shell" />
                    {errors.crefito && <span className="helper-text text-red-500">{errors.crefito.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="form-label">E-mail profissional</label>
                  <input {...register('email')} type="email" placeholder="voce@clinica.com" className="input-shell" />
                  {errors.email && <span className="helper-text text-red-500">{errors.email.message}</span>}
                </div>

                <div>
                  <label className="form-label">Senha</label>
                  <input {...register('password')} type="password" placeholder="Mínimo de 6 caracteres" className="input-shell" />
                  {errors.password && <span className="helper-text text-red-500">{errors.password.message}</span>}
                </div>

                <button type="submit" disabled={isSubmitting} className="primary-button mt-2 w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Finalizando cadastro...
                    </>
                  ) : (
                    <>
                      Finalizar cadastro
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                Já tem conta?{' '}
                <Link to="/" className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200">
                  Voltar para o login
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
