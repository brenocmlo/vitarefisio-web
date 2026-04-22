import React, { ReactNode } from 'react';
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
  Laptop
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext'; // Importamos o hook

export function Layout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme(); // Usando o contexto

  // Função para alternar entre Claro, Escuro e Sistema
  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Pacientes', icon: Users, path: '/pacientes' },
    { label: 'Agenda', icon: Calendar, path: '/agenda' },
    { label: 'Prontuários', icon: FileText, path: '/prontuarios' },
    { label: 'Financeiro', icon: DollarSign, path: '/financeiro' },
  ];

  return (
    // Fundo principal escuro e transição suave
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Sidebar - Fundo e bordas escuras */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-500 flex items-center gap-2">
            VitareFisio
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' 
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Superior - Fundo escuro */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shadow-sm z-10 transition-colors duration-200">
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
             {/* Espaço reservado para Breadcrumb ou Search */}
          </div>
          
          <div className="flex items-center gap-5">
            {/* Botão do Dark Mode */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              title={`Tema atual: ${theme}`}
            >
              {theme === 'light' && <Sun className="w-5 h-5 text-amber-500" />}
              {theme === 'dark' && <Moon className="w-5 h-5 text-blue-400" />}
              {theme === 'system' && <Laptop className="w-5 h-5" />}
            </button>

            {/* Perfil do Usuário */}
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-5">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">{user?.nome}</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">Fisioterapeuta</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <UserIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 text-slate-900 dark:text-slate-100">
          {children}
        </div>
      </main>
    </div>
  );
}