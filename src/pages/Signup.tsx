import { ArrowLeft, ArrowRight, CheckCircle2, Moon, Sparkles, Sun, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const plans = [
  {
    name: 'MENSAL',
    price: '69,90',
    period: '/mês',
    isFeatured: false,
    link: 'https://pay.kiwify.com.br/IeVr2EM',
  },
  {
    name: 'SEMESTRAL',
    price: '59,90',
    period: '/mês',
    totalPrice: '359,40',
    discount: 'Economia de R$ 60,00',
    tag: 'Mais Escolhido',
    isFeatured: true,
    link: 'https://pay.kiwify.com.br/GCelPc5',
  },
  {
    name: 'ANUAL',
    price: '49,90',
    period: '/mês',
    totalPrice: '598,80',
    discount: 'Economia de R$ 240,00',
    tag: 'Economia Máxima',
    isFeatured: false,
    link: 'https://pay.kiwify.com.br/Ut6gYjh',
  },
];

const benefits = [
  'Acesso completo a todas as ferramentas (Agenda, Evoluções, Receitas e Prontuários).',
  'Aplicativo do Paciente gratuito e integrado.',
  'Suporte prioritário via WhatsApp.',
];

export function Signup() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Blurred background glow effects */}
      <div className="pointer-events-none absolute left-0 top-16 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="surface-panel w-full p-6 sm:p-10 md:p-12">
          {/* Header Actions */}
          <div className="absolute right-6 top-6 flex items-center gap-2">
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

          {/* Intro Header */}
          <div className="max-w-3xl mb-12">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="eyebrow mb-2">Fluxo de Cadastro</p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
              Escolha seu plano para começar
            </h1>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              O cadastro no SomosFisio é liberado de forma segura imediatamente após a confirmação do pagamento de sua assinatura. Siga as etapas abaixo:
            </p>

            {/* Steps Guide */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="surface-muted p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">Passo 1</div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Escolha do Plano</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Escolha a melhor assinatura para sua rotina logo abaixo.</p>
              </div>
              <div className="surface-muted p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">Passo 2</div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Pagamento Seguro</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Efetue o pagamento na plataforma segura de checkout (Kiwify).</p>
              </div>
              <div className="surface-muted p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">Passo 3</div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Ativação por E-mail</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Verifique seu e-mail para ativar sua conta e definir sua senha.</p>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col justify-between p-8 rounded-[32px] border transition-all duration-300 hover:scale-[1.02] ${
                  plan.isFeatured
                    ? 'bg-gradient-to-br from-sky-600 to-blue-700 text-white border-sky-500 shadow-xl shadow-sky-500/10'
                    : 'bg-white/80 dark:bg-slate-900/60 text-slate-950 dark:text-slate-50 border-slate-200/60 dark:border-slate-800/60 shadow-md'
                }`}
              >
                {plan.tag && (
                  <span className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-md ${
                    plan.isFeatured ? 'bg-slate-950 text-white' : 'bg-sky-600 text-white'
                  }`}>
                    {plan.tag}
                  </span>
                )}

                <div>
                  <h3 className="text-xs font-black mb-6 opacity-85 uppercase tracking-[0.25em]">{plan.name}</h3>

                  <div className="mb-2 flex items-baseline gap-0.5">
                    <span className="text-lg font-black opacity-75">R$</span>
                    <span className="text-5xl font-black tracking-tight">{plan.price.split(',')[0]}</span>
                    <span className="text-lg font-black">,{plan.price.split(',')[1]}</span>
                    <span className="text-sm opacity-75 font-semibold ml-1">{plan.period}</span>
                  </div>

                  <div className="min-h-[48px] mb-6">
                    {plan.totalPrice && (
                      <p className="text-xs font-semibold opacity-75 mb-1.5">Total de R$ {plan.totalPrice}</p>
                    )}
                    {plan.discount && (
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        plan.isFeatured ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {plan.discount}
                      </span>
                    )}
                  </div>

                  <hr className={`my-6 border-t ${plan.isFeatured ? 'border-white/10' : 'border-slate-200/60 dark:border-slate-800/60'}`} />

                  <div className="space-y-4 mb-8">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs font-semibold leading-relaxed">
                        <CheckCircle2 size={16} className={`shrink-0 ${plan.isFeatured ? 'text-sky-300' : 'text-sky-600'}`} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={plan.link}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
                    plan.isFeatured
                      ? 'bg-white text-blue-700 hover:bg-slate-50 hover:shadow-lg hover:shadow-white/10'
                      : 'bg-slate-950 text-white hover:bg-sky-600 dark:bg-slate-800 dark:hover:bg-sky-600'
                  }`}
                >
                  Assinar Agora
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Valores promocionais de lançamento válidos por tempo limitado.
            </p>
            <Link to="/" className="text-sm font-bold text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200 flex items-center gap-1">
              Já tem uma conta? Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
