import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { UserPlus, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Schema rigoroso para bater com o seu backend
const signupSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  cpf: z.string().length(11, 'O CPF deve ter 11 dígitos'),
  crefito: z.string().min(3, 'CREFITO obrigatório'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function Signup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  async function handleSignup(data: SignupFormValues) {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Chamada para a rota de transação do autônomo
      await api.post('/signup/autonomo', data);
      
      alert('Cadastro realizado com sucesso! Faça seu login.');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao realizar cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-blue-50 rounded-full mb-3">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Seja VitareFisio</h1>
          <p className="text-slate-500 text-sm text-center">
            Crie sua conta e comece a gerir seus atendimentos hoje mesmo.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleSignup)} className="grid grid-cols-1 gap-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input
              {...register('nome')}
              placeholder="Ex: Dr. Ricardo Silva"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            {errors.nome && <span className="text-xs text-red-500">{errors.nome.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CPF (somente números)</label>
              <input
                {...register('cpf')}
                maxLength={11}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.cpf && <span className="text-xs text-red-500">{errors.cpf.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CREFITO</label>
              <input
                {...register('crefito')}
                placeholder="Ex: 123456-F"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.crefito && <span className="text-xs text-red-500">{errors.crefito.message}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Profissional</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sua Senha</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalizar Cadastro'}
          </button>
        </form>

        <Link 
          to="/" 
          className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o login
        </Link>
      </div>
    </div>
  );
}