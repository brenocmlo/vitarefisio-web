import { createContext, useEffect, useState, type ReactNode, type ReactElement } from 'react';
import api from '../services/api';

interface User {
  id: number;
  nome: string;
  email: string;
  clinica_id?: number;
  tipo: 'admin' | 'fisioterapeuta' | 'recepcao';
  is_autonomo?: boolean;
}

interface SignInCredentials {
  email: string;
  senha: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@VitareFisio:user');
    const storagedToken = localStorage.getItem('@VitareFisio:token');

    if (storagedUser && storagedToken) {
      try {
        setUser(JSON.parse(storagedUser));
      } catch (error) {
        console.error("Erro ao fazer parse do usuário no localStorage", error);
        localStorage.removeItem('@VitareFisio:user');
        localStorage.removeItem('@VitareFisio:token');
      }
    }
    setLoading(false);
  }, []);

  async function signIn({ email, senha }: SignInCredentials) {
    try {
      const response = await api.post('/login', { email, senha });
      const { token, user } = response.data;

      // O Interceptor do api.ts já vai pegar esse token nas próximas requisições!
      localStorage.setItem('@VitareFisio:token', token);
      localStorage.setItem('@VitareFisio:user', JSON.stringify(user));
      
      setUser(user);
    } catch (error) {
      throw error; 
    }
  }

  function signOut() {
    localStorage.removeItem('@VitareFisio:token');
    localStorage.removeItem('@VitareFisio:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};