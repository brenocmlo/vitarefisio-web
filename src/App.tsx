import { type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { MedicalRecord } from './pages/MedicalRecord';
import { Agenda } from './pages/Agenda';
import { Financeiro } from './pages/Financeiro';
import { ThemeProvider } from './contexts/ThemeContext';

function PrivateRoute({ children }: { children: ReactElement }) {
  const { signed, loading } = useAuth();
  
  // Adicionado suporte a dark mode no loading
  if (loading) return <div className="flex h-screen items-center justify-center dark:bg-slate-950 dark:text-white">Carregando...</div>;
  if (!signed) return <Navigate to="/" />;
  
  return children;
}

export default function App() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    // O ThemeProvider agora envolve toda a aplicação
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={signed ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/agenda" element={<PrivateRoute><Layout><Agenda/></Layout></PrivateRoute>} />
          <Route path="/pacientes" element={<PrivateRoute><Layout><Patients /></Layout></PrivateRoute>} />
          <Route path="/pacientes/:id/prontuario" element={<PrivateRoute><Layout><MedicalRecord /></Layout></PrivateRoute>}/>
          <Route path="/financeiro" element={<PrivateRoute><Layout><Financeiro /></Layout></PrivateRoute>}/>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}