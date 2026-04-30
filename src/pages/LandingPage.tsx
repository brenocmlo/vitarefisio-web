import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  CheckCircle2, 
  Calendar, 
  Users, 
  FileText, 
  PieChart, 
  MessageSquare, 
  Plus, 
  Star, 
  ChevronDown, 
  Stethoscope,
  LayoutDashboard,
  Smartphone,
  ClipboardCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Globe,
  Instagram,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// --- Sub-components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const navLinks = [
    { name: 'Sobre', href: '#sobre' },
    { name: 'Funcionalidades', href: '#funcionalidades' },
    { name: 'Planos', href: '#planos' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl z-50 border-b border-slate-200/50 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex-shrink-0 flex items-center group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform">
              <Stethoscope className="text-white" size={24} />
            </div>
            <span className="text-slate-900 dark:text-white font-extrabold text-2xl tracking-tighter">
              somos<span className="text-blue-600">fisio</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all text-sm tracking-tight"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              title="Alternar tema"
            >
              {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a 
              href="https://www.instagram.com/somosfisioapp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-600 transition-colors p-2"
              title="Siga-nos no Instagram"
            >
              <Instagram size={20} />
            </a>
            <Link to="/login" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm">
              Entrar
            </Link>
            <button
              onClick={() => window.location.href = '#COLE_SEU_LINK_DO_ABACATEPAY_AQUI'}
              className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white text-white px-7 py-3 rounded-full font-bold text-sm transition-all shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-blue-200 active:scale-95"
            >
              EXPERIMENTE GRÁTIS
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-500 dark:text-slate-400"
            >
              {resolvedTheme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 dark:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-bold text-slate-800 dark:text-white"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Link to="/login" onClick={() => setIsOpen(false)} className="font-bold text-slate-600 dark:text-slate-400">
                Entrar
              </Link>
              <a 
                href="https://www.instagram.com/somosfisioapp/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-bold text-pink-600"
              >
                <Instagram size={20} />
                Instagram
              </a>
            </div>
            <button
              onClick={() => { setIsOpen(false); window.location.href = '#COLE_SEU_LINK_DO_ABACATEPAY_AQUI'; }}
              className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
            >
              TESTE GRÁTIS DURANTE 15 DIAS
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden dark:bg-slate-950 transition-colors duration-500">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-[120px]"></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-widest mb-10 border border-blue-100 dark:border-blue-500/20 animate-bounce">
        <Sparkles size={14} />
        quer profissionalizar sua clínica?
      </div>
      
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
        Gestão clínica <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">descomplicada.</span>
      </h1>
      
      <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
        Elimine o papel, organize seus pacientes e tenha controle total do financeiro com o sistema mais moderno do Brasil.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 fill-mode-both">
        <button
          onClick={() => window.location.href = '#COLE_SEU_LINK_DO_ABACATEPAY_AQUI'}
          className="group relative bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-2xl font-extrabold text-xl transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          COMEÇAR AGORA
          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
        
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase text-[10px] tracking-[0.2em]">
            <Zap size={14} className="text-yellow-500" />
            SISTEMA COMPLETO + APP
          </div>
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                U{i}
              </div>
            ))}
            <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold flex items-center border border-blue-100 dark:border-blue-800/50 ml-2">
              +1.200 fisioterapeutas
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ForWhom = () => {
  const cards = [
    { title: 'Fisioterapeutas Autônomos', icon: <Users />, desc: 'Organização total para sua agenda.' },
    { title: 'Clínicas de Fisioterapia', icon: <Stethoscope />, desc: 'Gestão de equipe e financeiro avançado.' },
    { title: 'Clínicas de Reabilitação', icon: <ClipboardCheck />, desc: 'Prontuários e evolução com agilidade.' },
    { title: 'Estúdios de Pilates', icon: <LayoutDashboard />, desc: 'Controle de turmas e mensalidades.' },
  ];

  return (
    <section id="sobre" className="py-32 bg-white dark:bg-slate-950 relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            SomosFisio é para você?
          </h2>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className={`reveal-hidden reveal-delay-${(idx % 4) + 1} group p-10 rounded-[40px] bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-white/10 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] flex flex-col`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500">
                {React.cloneElement(card.icon as React.ReactElement<any>, { 
                  className: "w-8 h-8 text-blue-600 group-hover:text-white transition-colors" 
                })}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { 
      title: 'Agenda Inteligente', 
      desc: 'Sincronização em tempo real com Google Calendar e lembretes automáticos via WhatsApp que reduzem faltas em até 45%.',
      icon: <Calendar />, 
      color: 'bg-blue-500',
      size: 'md:col-span-2 md:row-span-1',
      extra: <div className="mt-4 flex gap-2 overflow-hidden opacity-50"><div className="h-2 w-12 bg-blue-400 rounded-full"></div><div className="h-2 w-20 bg-blue-400/50 rounded-full"></div></div>
    },
    { 
      title: 'Prontuário Digital', 
      desc: 'Evoluções rápidas e seguras. Elimine o papel e tenha o histórico clínico na palma da mão.',
      icon: <FileText />, 
      color: 'bg-indigo-500',
      size: 'md:col-span-1 md:row-span-2',
      extra: <div className="mt-8 space-y-2 opacity-30"><div className="h-1 w-full bg-indigo-400 rounded"></div><div className="h-1 w-2/3 bg-indigo-400 rounded"></div><div className="h-1 w-full bg-indigo-400 rounded"></div></div>
    },
    { 
      title: 'Financeiro Total', 
      desc: 'Gestão de faturamento, pacotes e sessões de forma automatizada.',
      icon: <TrendingUp />, 
      color: 'bg-emerald-500',
      size: 'md:col-span-1 md:row-span-1'
    },
    { 
      title: 'App do Paciente', 
      desc: 'Seu paciente acompanha a evolução e as sessões restantes pelo próprio celular.',
      icon: <Smartphone />, 
      color: 'bg-amber-500',
      size: 'md:col-span-1 md:row-span-1'
    },
    { 
      title: 'Gestão de Clínicas', 
      desc: 'Controle de equipe, comissões e múltiplos fisioterapeutas em um único workspace.',
      icon: <Globe />, 
      color: 'bg-violet-500',
      size: 'md:col-span-1 md:row-span-1'
    },
  ];

  return (
    <section id="funcionalidades" className="py-32 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[0.95]">
            Funcionalidades que <br /> <span className="text-blue-500 text-glow">mudam o jogo.</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium">
            Tudo o que você precisa para gerir sua carreira em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className={`reveal-hidden reveal-delay-${(idx % 3) + 1} group p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${feat.size || ''}`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(feat.icon as React.ReactElement<any>, { size: 24, className: "text-white" })}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium line-clamp-3">
                  {feat.desc}
                </p>
              </div>
              {feat.extra}
              
              {/* Efeito de luz sutil no hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const plans = [
    {
      name: 'MENSAL',
      price: '69,90',
      period: '/mês',
      isFeatured: false,
      link: 'https://app.abacatepay.com/pay/bill_fbHuuzxfE15cnpudAnATCEqD',
    },
    {
      name: 'SEMESTRAL',
      price: '59,90',
      period: '/mês',
      totalPrice: '359,40',
      discount: 'Economia de R$ 60,00',
      tag: 'Mais Escolhido',
      isFeatured: true,
      link: 'https://app.abacatepay.com/pay/bill_BpRFxJNPr4CSreQ0MKz6hAnR',
    },
    {
      name: 'ANUAL',
      price: '49,90',
      period: '/mês',
      totalPrice: '598,80',
      discount: 'Economia de R$ 240,00',
      tag: 'Economia Máxima',
      isFeatured: false,
      link: 'https://app.abacatepay.com/pay/bill_ENu6C3ct1H3BX2dPJ5ETx3tq',
    },
  ];

  return (
    <section id="planos" className="py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Planos para Fisioterapeutas Autônomos
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mb-20 max-w-2xl mx-auto">
          A liberdade que você precisa com o controle que sua carreira merece. Teste por 15 dias sem compromisso.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center group/pricing-grid">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-12 rounded-[48px] flex flex-col transition-all duration-500 
                group-hover/pricing-grid:scale-[0.93] group-hover/pricing-grid:opacity-60 
                hover:!scale-[1.05] hover:!opacity-100 hover:z-20 
                ${plan.isFeatured 
                  ? 'bg-blue-600 text-white shadow-[0_40px_100px_-20px_rgba(37,99,235,0.4)]' 
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-transparent dark:border-white/5'
                }`}
            >
              {plan.tag && (
                <span className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                  plan.isFeatured ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {plan.tag}
                </span>
              )}
              
              <h3 className="text-sm font-black mb-10 opacity-70 uppercase tracking-[0.3em]">{plan.name}</h3>
              
              <div className="mb-2 flex items-baseline justify-center gap-1">
                <span className="text-2xl font-black opacity-60">R$</span>
                <span className="text-7xl font-black tracking-tighter">{plan.price.split(',')[0]}</span>
                <span className="text-2xl font-black">,{plan.price.split(',')[1]}</span>
                <span className="text-lg opacity-60 font-bold ml-1">{plan.period}</span>
              </div>
              
              <div className="min-h-[80px] mb-6">
                {plan.totalPrice && (
                  <p className="text-sm font-bold opacity-70 mb-2">Total de R$ {plan.totalPrice}</p>
                )}
                {plan.discount && (
                  <div className="flex justify-center">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      plan.isFeatured ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {plan.discount}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-5 mb-12 flex-grow text-left">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-4 text-sm font-bold tracking-tight">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${plan.isFeatured ? 'bg-white/20' : 'bg-blue-50'}`}>
                      <CheckCircle2 size={14} className={plan.isFeatured ? 'text-white' : 'text-blue-600'} />
                    </div>
                    {i === 1 ? 'Acesso Total ao Sistema' : i === 2 ? 'App do Paciente' : 'Suporte VIP via WhatsApp'}
                  </div>
                ))}
              </div>

              <button
                onClick={() => window.location.href = plan.link}
                className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-95 shadow-xl ${
                  plan.isFeatured 
                    ? 'bg-white text-blue-600 hover:shadow-white/20' 
                    : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-200'
                }`}
              >
                TESTE GRÁTIS DURANTE 15 DIAS
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ClinicaCTA = () => {
  return (
    <section className="py-24 bg-blue-600 dark:bg-blue-700 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-[48px] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-white text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck size={14} />
              Solução Corporativa
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-6">
              Você é dono de clínica? <br />
              <span className="text-blue-200">Temos ofertas especiais.</span>
            </h2>
            <p className="text-blue-100 text-lg font-medium opacity-80 mb-8">
              Sistemas multi-usuários, relatórios avançados de produtividade e faturamento consolidado. Fale com um especialista para um plano sob medida.
            </p>
          </div>
          
          <button
            onClick={() => window.open('https://wa.me/5585988335991?text=Olá! Sou dono de clínica e gostaria de conhecer os planos especiais do SomosFisio.', '_blank')}
            className="group bg-white text-blue-600 px-12 py-6 rounded-2xl font-black text-xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4"
          >
            FALAR COM ESPECIALISTA
            <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions = [
    { q: 'O SomosFisio é difícil de aprender?', a: 'Não! É o sistema mais intuitivo do mercado. Em 15 minutos você já domina as funções principais.' },
    { q: 'Como funcionam os 15 dias grátis?', a: 'Você cria sua conta, usa tudo e só paga se gostar. Não pedimos cartão de crédito para o teste.' },
    { q: 'Posso acessar pelo celular?', a: 'Com certeza! Temos um App dedicado e a versão web funciona perfeitamente em qualquer dispositivo.' },
    { q: 'O sistema envia WhatsApp automático?', a: 'Sim! Reduzimos as faltas em até 45% com lembretes inteligentes que confirmam a presença do seu paciente.' },
  ];

  return (
    <section id="faq" className="py-32 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-black text-center text-slate-900 dark:text-white tracking-tight mb-20">
          Dúvidas comuns.
        </h2>
        <div className="space-y-4">
          {questions.map((item, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl border transition-all duration-300 ${openIndex === idx ? 'border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-8 text-left"
              >
                <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">{item.q}</span>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${openIndex === idx ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-white/20 text-slate-400'}`}>
                  {openIndex === idx ? <X size={14} /> : <Plus size={14} />}
                </div>
              </button>
              {openIndex === idx && (
                <div className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 pt-32 pb-16 text-white overflow-hidden relative transition-colors duration-500">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/20 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="mb-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-12 max-w-4xl mx-auto">
            A revolução na sua clínica começa com <span className="text-blue-500">um clique.</span>
          </h2>
          <button
            onClick={() => window.location.href = '#COLE_SEU_LINK_DO_ABACATEPAY_AQUI'}
            className="bg-white dark:bg-blue-600 text-slate-900 dark:text-white px-16 py-8 rounded-[32px] font-black text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-white/20 mb-12"
          >
            TESTE GRÁTIS DURANTE 15 DIAS
          </button>
          <div className="flex flex-wrap justify-center gap-10 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2 underline decoration-blue-500 decoration-2 underline-offset-4">Sem cartão</div>
            <div className="flex items-center gap-2 underline decoration-blue-500 decoration-2 underline-offset-4">Sem contrato</div>
            <div className="flex items-center gap-2 underline decoration-blue-500 decoration-2 underline-offset-4">Suporte VIP</div>
          </div>
        </div>
        
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center group cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Stethoscope className="text-white" size={18} />
            </div>
            <span className="font-black text-xl tracking-tighter">somos<span className="text-blue-500">fisio</span></span>
          </div>
          <p className="text-slate-500 text-sm font-bold">
            © {new Date().getFullYear()} SomosFisio — Made with passion for health.
          </p>
          <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <a 
              href="https://www.instagram.com/somosfisioapp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors flex items-center gap-2"
            >
              <Instagram size={16} />
              Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page Component ---

const LandingPage: React.FC = () => {
  React.useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.reveal-hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white selection:bg-blue-600 selection:text-white scroll-smooth transition-colors duration-500">
      <Navbar />
      <main>
        <Hero />
        <div className="reveal-hidden"><ForWhom /></div>
        <div className="reveal-hidden"><Features /></div>
        <div className="reveal-hidden"><Pricing /></div>
        <div className="reveal-hidden"><ClinicaCTA /></div>
        <div className="reveal-hidden"><FAQ /></div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
