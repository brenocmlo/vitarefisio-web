import { type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { MedicalRecord } from './pages/MedicalRecord';
import { Agenda } from './pages/Agenda';
import { Financeiro } from './pages/Financeiro';
import { Staff } from './pages/Staff'; // <-- NOVA IMPORTAÇÃO
import { useTheme } from './contexts/ThemeContext';

interface PrivateRouteProps {
  children: ReactElement;
  allowedRoles?: Array<'admin' | 'fisioterapeuta' | 'recepcao'>;
}

function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { signed, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center px-6">
        <div className="surface-panel flex min-w-[280px] items-center justify-center gap-3 px-6 py-5 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-500" />
          Carregando ambiente clínico...
        </div>
      </div>
    );
  }

  if (!signed) return <Navigate to="/" />;

  if (allowedRoles && user && !allowedRoles.includes(user.tipo)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

export default function App() {
  const { signed, loading } = useAuth();
  const { resolvedTheme } = useTheme();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center px-6">
        <div className="surface-panel flex min-w-[280px] items-center justify-center gap-4 px-6 py-5">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-400" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">Preparando o SomosFisio</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sincronizando sua sessão segura.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={signed ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* ROTAS GERAIS: Todos acessam */}
          <Route path="/dashboard" element={<PrivateRoute allowedRoles={['admin', 'fisioterapeuta', 'recepcao']}><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/agenda" element={<PrivateRoute allowedRoles={['admin', 'fisioterapeuta', 'recepcao']}><Layout><Agenda/></Layout></PrivateRoute>} />
          <Route path="/pacientes" element={<PrivateRoute allowedRoles={['admin', 'fisioterapeuta', 'recepcao']}><Layout><Patients /></Layout></PrivateRoute>} />
          
          {/* ROTAS SENSÍVEIS (CLÍNICAS): Admin e Fisioterapeuta */}
          <Route path="/pacientes/:id/prontuario" element={<PrivateRoute allowedRoles={['admin', 'fisioterapeuta']}><Layout><MedicalRecord /></Layout></PrivateRoute>}/>
          
          {/* ROTAS ADMINISTRATIVAS/FINANCEIRAS: Admin e Recepção */}
          <Route path="/financeiro" element={<PrivateRoute allowedRoles={['admin', 'recepcao']}><Layout><Financeiro /></Layout></PrivateRoute>}/>

          {/* ROTA EXCLUSIVA DE GESTÃO: Apenas Admin */}
          <Route path="/equipe" element={<PrivateRoute allowedRoles={['admin']}><Layout><Staff /></Layout></PrivateRoute>}/>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        closeButton
        position="top-right"
        richColors
        theme={resolvedTheme}
        toastOptions={{
          className: 'font-sans',
        }}
      />
    </>
  );
}