import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'fisioterapeuta' | 'recepcao'>;
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
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

  if (!signed) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.tipo)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
}