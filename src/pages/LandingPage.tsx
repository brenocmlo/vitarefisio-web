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
  ArrowRight
} from 'lucide-react';

// --- Sub-components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Sobre', href: '#sobre' },
    { name: 'Funcionalidades', href: '#funcionalidades' },
    { name: 'Planos e Preços', href: '#planos' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Blog', href: '#' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group">
            <span className="text-blue-600 font-extrabold text-xl tracking-tight">
              somos<span className="text-slate-900">fisio</span>
            </span>
            <span className="ml-2 text-slate-400 text-xs hidden sm:block uppercase tracking-widest font-medium">
              — o seu sistema de gestão
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-bold text-sm">
              Login
            </Link>
            <button
              onClick={() => window.location.href = 'https://pay.kiwify.com.br/SEU_ID_AQUI'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-lg shadow-blue-200"
            >
              QUERO 30 DIAS GRÁTIS
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-8 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-4">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center font-bold text-slate-600 py-2">
                Login
              </Link>
              <button
                onClick={() => { setIsOpen(false); window.location.href = 'https://pay.kiwify.com.br/SEU_ID_AQUI'; }}
                className="bg-blue-600 text-white text-center px-6 py-4 rounded-xl font-bold transition-all shadow-lg"
              >
                QUERO 30 DIAS GRÁTIS
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-70"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-slate-100 rounded-full blur-3xl -z-10 opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest mb-6 animate-fade-in">
          quer profissionalizar sua clínica de fisioterapia?
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
          somosfisio, o sistema de gestão <br className="hidden lg:block" />
          da sua clínica de fisioterapia
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed mb-10">
          desenvolvido para eliminar o papel, organizar seus pacientes e te dar controle total do financeiro — 
          <span className="text-slate-900 font-medium"> liberando você para focar no que realmente importa: tratar pessoas.</span>
        </p>
        
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => window.location.href = 'https://pay.kiwify.com.br/SEU_ID_AQUI'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-full font-extrabold text-lg md:text-xl transition-all transform hover:scale-105 shadow-2xl shadow-blue-200 flex items-center gap-3 group"
          >
            QUERO 30 DIAS GRÁTIS
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg">
            <Smartphone size={16} className="text-blue-400" />
            SISTEMA COMPLETO + APP
          </div>
        </div>
      </div>
    </section>
  );
};

const ForWhom = () => {
  const cards = [
    { title: 'Fisioterapeutas Autônomos', icon: <Users className="text-blue-600" /> },
    { title: 'Clínicas de Fisioterapia', icon: <Stethoscope className="text-blue-600" /> },
    { title: 'Clínicas de Reabilitação', icon: <ClipboardCheck className="text-blue-600" /> },
    { title: 'Estúdios de Pilates Clínico', icon: <LayoutDashboard className="text-blue-600" /> },
  ];

  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16">
          somosfisio para quem é?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-50 group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                {React.cloneElement(card.icon as React.ReactElement<any>, { 
                  className: "w-8 h-8 text-blue-600 group-hover:text-white transition-colors" 
                })}
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {card.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Reasons = () => {
  const reasons = [
    { 
      title: 'Todas as funções administrativas em um só lugar', 
      desc: 'Centralize agenda, financeiro e prontuários sem precisar de múltiplas ferramentas ou planilhas confusas.' 
    },
    { 
      title: 'Comunicação direta com seu paciente', 
      desc: 'Destaque para automação no WhatsApp: lembretes de consultas automáticos que reduzem faltas em até 40%.',
      highlight: true
    },
    { 
      title: 'Prontuário eletrônico completo', 
      desc: 'Histórico clínico detalhado, anamneses personalizadas e evolução do paciente com segurança e agilidade.' 
    },
    { 
      title: 'Armazenamento de exames e documentos', 
      desc: 'Anexe PDFs, fotos e laudos diretamente na ficha do paciente. Acesse tudo em segundos de qualquer lugar.' 
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-20 max-w-4xl mx-auto leading-tight">
          4 motivos para usar um sistema de gestão na sua clínica de fisioterapia!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-blue-200">
                {idx + 1}
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-3 ${reason.highlight ? 'text-blue-600' : 'text-slate-900'}`}>
                  {reason.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { title: 'Prontuário Eletrônico', icon: <FileText /> },
    { title: 'Avaliações', icon: <ClipboardCheck /> },
    { title: 'Armazenamento de Exames', icon: <Plus /> },
    { title: 'Controle Financeiro', icon: <PieChart /> },
    { title: 'Agendamento Online', icon: <Calendar /> },
    { title: 'App do Paciente', icon: <Smartphone /> },
    { title: 'Comunicação via WhatsApp', icon: <MessageSquare /> },
    { title: 'Relatórios Gerenciais', icon: <LayoutDashboard /> },
  ];

  return (
    <section id="funcionalidades" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          funcionalidades que fazem a diferença
        </h2>
        <p className="text-slate-500 text-lg mb-16">
          o somosfisio foi desenvolvido especialmente para você...
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 text-left">
          {features.map((feat, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-all group">
              <div className="mb-4 text-blue-600 group-hover:scale-110 transition-transform origin-left">
                {React.cloneElement(feat.icon as React.ReactElement<any>, { size: 32 })}
              </div>
              <h3 className="font-bold text-slate-900">{feat.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const plans = [
    {
      name: 'PLANO MENSAL',
      price: '19,90',
      subPrice: 'depois R$ 59,90',
      period: 'no primeiro mês',
      features: ['Acesso Total', 'Suporte VIP', 'Sem Fidelidade'],
      isFeatured: false,
    },
    {
      name: 'PLANO TRIMESTRAL',
      price: '47,90',
      period: '/mês',
      tag: 'Mais escolhido',
      features: ['Economia de 20%', 'App do Paciente', 'Faturamento Completo'],
      isFeatured: true,
    },
    {
      name: 'PLANO ANUAL',
      price: '39,90',
      period: '/mês',
      tag: 'Melhor custo-benefício',
      features: ['Economia de 35%', 'Multiusuários', 'Relatórios Customizados'],
      isFeatured: false,
    },
  ];

  return (
    <section id="planos" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          planos para cada momento da sua clínica
        </h2>
        <p className="text-slate-400 mb-16">
          sem taxa de adesão, sem contrato e com 30 dias grátis...
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-10 rounded-[2.5rem] flex flex-col transition-all duration-300 ${
                plan.isFeatured 
                  ? 'bg-blue-600 scale-105 shadow-2xl shadow-blue-500/20 z-20' 
                  : 'bg-slate-800 hover:bg-slate-800/80'
              }`}
            >
              {plan.tag && (
                <span className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  plan.isFeatured ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                }`}>
                  {plan.tag}
                </span>
              )}
              <h3 className="text-lg font-bold mb-6 opacity-80 uppercase tracking-widest">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-5xl font-extrabold tracking-tight">R$ {plan.price}</span>
                <span className="text-lg opacity-70"> {plan.period}</span>
              </div>
              {plan.subPrice && <p className="text-sm opacity-60 mb-8">{plan.subPrice}</p>}
              
              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 size={18} className={plan.isFeatured ? 'text-blue-200' : 'text-blue-500'} />
                    {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => window.location.href = 'https://pay.kiwify.com.br/SEU_ID_AQUI'}
                className={`w-full py-5 rounded-2xl font-extrabold transition-all transform active:scale-95 ${
                  plan.isFeatured 
                    ? 'bg-white text-blue-600 hover:bg-slate-50' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                EXPERIMENTE 30 DIAS GRÁTIS
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    { name: 'Aline Mendes', role: 'Fisioterapeuta e Gestora', text: 'O SomosFisio transformou minha clínica. Antes eu perdia muito tempo com papel, hoje tenho tudo na palma da mão.' },
    { name: 'Rafael Costa', role: 'Autônomo', text: 'Os lembretes de WhatsApp são fenomenais. Meus pacientes adoram e as faltas praticamente zeraram.' },
    { name: 'Juliana Santos', role: 'Studio de Pilates', text: 'Sistema prático e suporte nota 10. Recomendo para todos os colegas que querem profissionalizar a gestão.' },
  ];

  return (
    <section id="depoimentos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16">
          o que nossos clientes dizem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#EAB308" color="#EAB308" />)}
              </div>
              <p className="text-slate-700 italic mb-6 leading-relaxed flex-grow">"{t.text}"</p>
              <div>
                <h4 className="font-bold text-slate-900">{t.name}</h4>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions = [
    { q: 'O SomosFisio é difícil de aprender a usar?', a: 'Não! Desenvolvemos o sistema com foco total na usabilidade. Você e sua equipe estarão dominando todas as funções em poucos minutos.' },
    { q: 'Como funcionam os 30 dias grátis?', a: 'Você terá acesso total a todas as funcionalidades do plano escolhido por 30 dias. Não solicitamos cartão de crédito para o teste.' },
    { q: 'O sistema funciona no celular?', a: 'Sim! O SomosFisio é 100% responsivo e possui um aplicativo dedicado para que você possa gerenciar sua clínica de qualquer lugar.' },
    { q: 'Meus dados e dos meus pacientes estão seguros?', a: 'Segurança é nossa prioridade. Utilizamos criptografia de nível bancário e backups diários para garantir a proteção total das suas informações.' },
    { q: 'Posso cancelar minha assinatura quando quiser?', a: 'Com certeza. Não temos contratos de fidelidade ou taxas de cancelamento. Você tem liberdade total.' },
    { q: 'O sistema envia mensagens automáticas para pacientes?', a: 'Sim, um dos nossos grandes diferenciais é a automação via WhatsApp para lembretes de consultas, confirmações e aniversários.' },
    { q: 'Vocês oferecem suporte em português?', a: 'Sim, nosso suporte é 100% humanizado e em português, disponível via WhatsApp e e-mail para te ajudar sempre que precisar.' },
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-16">
          perguntas frequentes
        </h2>
        <div className="space-y-4">
          {questions.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900">{item.q}</span>
                {openIndex === idx ? <ChevronDown className="rotate-180 transition-transform" /> : <ChevronDown className="transition-transform" />}
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
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
  const navigate = useNavigate();
  return (
    <footer className="bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8">
            pronto para transformar sua clínica?
          </h2>
          <button
            onClick={() => window.location.href = 'https://pay.kiwify.com.br/SEU_ID_AQUI'}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-full font-extrabold text-xl md:text-2xl transition-all transform hover:scale-105 shadow-2xl shadow-blue-200 mb-8"
          >
            QUERO 30 DIAS GRÁTIS
          </button>
        <div className="flex flex-wrap justify-center gap-6 text-slate-500 font-medium text-sm">
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Sem cartão de crédito</div>
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Sem contrato</div>
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Suporte em português</div>
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Cancele quando quiser</div>
        </div>
      </div>
      
      <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center">
          <span className="text-blue-600 font-extrabold text-lg">somos<span className="text-slate-900">fisio</span></span>
        </div>
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} SomosFisio — Todos os direitos reservados.
        </p>
        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-blue-600 transition-colors">Termos</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacidade</a>
        </div>
      </div>
    </div>
    </footer>
  );
};

// --- Main Page Component ---

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <Hero />
        <ForWhom />
        <Reasons />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
