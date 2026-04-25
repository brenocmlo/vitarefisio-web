import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  DollarSign,
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
  Laptop,
  PanelLeft,
  X,
  Sparkles,
  ChevronRight,
  UserPlus, // <-- ADICIONADO ÍCONE DA EQUIPE
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', description: 'Resumo da operação diária', allowedRoles: ['admin', 'fisioterapeuta', 'recepcao'] },
  { label: 'Pacientes', icon: Users, path: '/pacientes', description: 'Cadastros e histórico clínico', allowedRoles: ['admin', 'fisioterapeuta', 'recepcao'] },
  { label: 'Agenda', icon: Calendar, path: '/agenda', description: 'Consultas e disponibilidade', allowedRoles: ['admin', 'fisioterapeuta', 'recepcao'] },
  { label: 'Prontuários', icon: FileText, path: '/prontuarios', description: 'Registro e evolução clínica', allowedRoles: ['admin', 'fisioterapeuta'] },
  { label: 'Financeiro', icon: DollarSign, path: '/financeiro', description: 'Caixa, pacotes e repasses', allowedRoles: ['admin', 'recepcao', 'fisioterapeuta'] },
  { label: 'Equipe', icon: UserPlus, path: '/equipe', description: 'Gestão de profissionais', allowedRoles: ['admin'] }, // <-- NOVO MENU
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Painel da clínica',
    description: 'Tudo o que importa hoje em uma visão clara e acionável.',
  },
  '/pacientes': {
    title: 'Base de pacientes',
    description: 'Acompanhe cadastros, convênios e acesso rápido ao prontuário.',
  },
  '/agenda': {
    title: 'Agenda terapêutica',
    description: 'Organize horários, status de atendimento e encaixes do dia.',
  },
  '/financeiro': {
    title: 'Fluxo financeiro',
    description: 'Monitore recebimentos, pendências e lançamentos da clínica.',
  },
  '/equipe': { // <-- NOVOS META DADOS PARA CABEÇALHO
    title: 'Corpo clínico',
    description: 'Gerencie permissões e visualize os fisioterapeutas da unidade.',
  },
};

const themeOptions = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Laptop },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const currentPage = useMemo(() => {
    if (location.pathname.startsWith('/pacientes/') && location.pathname.includes('/prontuario')) {
      return {
        title: 'Prontuário eletrônico',
        description: 'Anamnese, evoluções, anexos e pacotes em um só lugar.',
      };
    }

    return pageMeta[location.pathname] ?? {
      title: 'SomosFisio',
      description: 'Gestão clínica com uma experiência mais clara e agradável.',
    };
  }, [location.pathname]);

  const initials = user?.nome
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const userRoleDisplay = user?.tipo ? user.tipo.charAt(0).toUpperCase() + user.tipo.slice(1) : '';

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_58%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_58%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-400/10" />

      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className="relative flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[86vw] max-w-[310px] transform p-2 sm:p-4 transition-transform duration-300 lg:static lg:w-[300px] lg:max-w-none lg:translate-x-0 ${
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="surface-panel flex h-full flex-col overflow-y-auto scrollbar-none p-4 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-2 sm:mb-6 sm:gap-3">
              <div>
                <div className="eyebrow mb-1 sm:mb-2">SomosFisio</div>
                <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 sm:text-2xl">
                  Gestão clínica
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-700 dark:text-slate-200 sm:mt-2 sm:text-sm sm:leading-6">
                  Mais foco na operação, menos atrito no dia a dia.
                </p>
              </div>
              <button
                type="button"
                className="icon-button lg:hidden"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Fechar navegação"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="surface-muted mb-4 p-3 sm:mb-6 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/12 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300 sm:h-11 sm:w-11">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-50 sm:text-sm">Tema sincronizado</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-300 sm:text-xs">
                    Aparência atual: {resolvedTheme === 'dark' ? 'escura' : 'clara'}.
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                if (user?.tipo && !item.allowedRoles.includes(user.tipo)) {
                  return null;
                }

                const isActive =
                  item.path === '/prontuarios'
                    ? location.pathname.includes('/prontuario')
                    : location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path === '/prontuarios' ? '/pacientes' : item.path}
                    className={`group flex items-center justify-between rounded-[22px] border px-4 py-3.5 transition-all duration-200 ${
                      isActive
                        ? 'border-sky-300/50 bg-sky-500/10 text-sky-700 shadow-[0_18px_40px_rgba(14,165,233,0.14)] dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300'
                        : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/50 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${
                          isActive
                            ? 'bg-white/70 text-sky-600 dark:bg-slate-900/70 dark:text-sky-300'
                            : 'bg-slate-100/80 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400'
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.label}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isActive ? 'translate-x-0 text-sky-500' : 'text-slate-300 group-hover:translate-x-0.5'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="surface-muted mt-6 space-y-4 p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Aparência</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const active = theme === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTheme(option.value)}
                        className={`rounded-2xl px-3 py-2.5 text-xs font-bold transition-all ${
                          active
                            ? 'bg-sky-500 text-white shadow-[0_16px_32px_rgba(14,165,233,0.22)]'
                            : 'bg-white/70 text-slate-500 hover:bg-white dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-900'
                        }`}
                      >
                        <span className="mb-1 flex justify-center">
                          <Icon className="h-4 w-4" />
                        </span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={signOut}
                className="secondary-button w-full justify-center border-red-200/60 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Sair do sistema
              </button>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col px-3 pb-5 pt-3 sm:px-5 sm:pb-6 sm:pt-4 lg:px-8">
          <header className="surface-panel sticky top-3 z-20 mb-5 overflow-hidden px-4 py-3.5 sm:top-4 sm:mb-6 sm:px-6 sm:py-4">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="icon-button h-10 w-10 lg:hidden shrink-0"
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Abrir navegação"
                >
                  <PanelLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow mb-1 sm:mb-2">Painel operacional</p>
                  <h1 className="font-display text-lg font-extrabold tracking-tight text-slate-950 dark:text-slate-50 sm:text-2xl truncate">
                    {currentPage.title}
                  </h1>
                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-300 sm:mt-2 sm:text-[15px] sm:leading-6">
                    {currentPage.description}
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <div className="surface-muted flex w-full items-center gap-3 px-3 py-2 sm:w-auto sm:px-3 sm:py-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/12 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300 sm:h-11 sm:w-11">
                    {initials ? (
                      <span className="text-xs font-extrabold sm:text-sm">{initials}</span>
                    ) : (
                      <UserIcon className="h-4 w-4 sm:h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{user?.nome}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-300 sm:text-xs">
                      {userRoleDisplay || 'Usuário'} da clínica
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}