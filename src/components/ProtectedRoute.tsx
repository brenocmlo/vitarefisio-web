// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'fisioterapeuta' | 'recepcao'>;
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  // 1. Se não estiver logado de jeito nenhum, chuta pro Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Se a rota tem uma lista de perfis permitidos E o usuário atual NÃO está nessa lista
  if (allowedRoles && !allowedRoles.includes(user.tipo)) {
    // Redireciona para o Dashboard (ou uma página de "Acesso Negado")
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Se estiver tudo certo, renderiza a tela que ele pediu
  return <Outlet />;
}