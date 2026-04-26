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
import { Staff } from './pages/Staff';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import { useTheme } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={signed ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* ROTAS COMUNS: Todos acessam */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'fisioterapeuta', 'recepcao']} />}>
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/agenda" element={<Layout><Agenda/></Layout>} />
            <Route path="/pacientes" element={<Layout><Patients /></Layout>} />
          </Route>
          
          {/* ROTAS SENSÍVEIS (CLÍNICAS): Admin e Fisioterapeuta */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'fisioterapeuta']} />}>
            <Route path="/pacientes/:id/prontuario" element={<Layout><MedicalRecord /></Layout>}/>
          </Route>
          
          {/* ROTAS ADMINISTRATIVAS/FINANCEIRAS: Admin, Recepção e Fisioterapeuta */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'recepcao', 'fisioterapeuta']} />}>
            <Route path="/financeiro" element={<Layout><Financeiro /></Layout>}/>
          </Route>

          {/* ROTA EXCLUSIVA DE GESTÃO: Apenas Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/equipe" element={<Layout><Staff /></Layout>}/>
          </Route>
          
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