import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface FisioterapeutaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FisioterapeutaFormModal({ isOpen, onClose, onSuccess }: FisioterapeutaFormModalProps) {
  const { user } = useAuth(); // Pegando os dados do Administrador logado
  const [isLoading, setIsLoading] = useState(false);

  // Estado que guarda o que o usuário digita no formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    crefito: '',
    telefone: '',
    especialidade: '',
    is_autonomo: false,
  });

  // Se o modal estiver fechado, não renderiza nada na tela
  if (!isOpen) return null;

  // Função genérica para atualizar os inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  }

  // A função principal que envia para o backend
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const clinicaId = Number(user?.clinica_id);

      if (!clinicaId) {
        toast.error("Erro de sessão: Clínica não identificada. Tente fazer logout e login novamente.");
        setIsLoading(false);
        return;
      }

      await api.post('/fisioterapeutas', {
        ...formData,
        tipo: 'fisioterapeuta',        
        clinica_id: clinicaId,
        is_autonomo: formData.is_autonomo,
        senha: 'mudar123',             
      });

      toast.success('Profissional cadastrado com sucesso!');
      
      // Limpa os campos para o próximo cadastro
      setFormData({ nome: '', email: '', cpf: '', crefito: '', telefone: '', especialidade: '' }); 
      
      onSuccess(); // Recarrega a lista lá atrás na página Staff.tsx
      onClose();   // Fecha o modal

    } catch (error: any) {
      // Captura de erro super detalhada
      if (error.response?.data?.erros_de_validacao) {
        // Se for erro do Schema, pega a primeira mensagem e mostra em português claro
        const erroReal = error.response.data.erros_de_validacao[0].message;
        toast.error(`Atenção: ${erroReal}`);
        console.error("Erros completos do Schema:", error.response.data.erros_de_validacao);
      } else {
        // Se for erro geral (ex: Email já existe)
        const backendError = error.response?.data?.error || error.response?.data?.message || 'Erro ao cadastrar profissional.';
        toast.error(backendError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        
        {/* CABEÇALHO DO MODAL */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Novo Profissional</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
            <input required type="text" name="nome" value={formData.nome} onChange={handleChange} 
                   className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" 
                   placeholder="Ex: Dr. João Silva" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email (Usado para Login)</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} 
                   className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" 
                   placeholder="joao@vitarefisio.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CPF</label>
              <input required type="text" name="cpf" value={formData.cpf} onChange={handleChange} 
                     className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" 
                     placeholder="000.000.000-00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CREFITO</label>
              <input required type="text" name="crefito" value={formData.crefito} onChange={handleChange} 
                     className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" 
                     placeholder="123456-F" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} 
                     className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" 
                     placeholder="(00) 00000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Especialidade</label>
              <input required type="text" name="especialidade" value={formData.especialidade} onChange={handleChange} 
                     className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" 
                     placeholder="Ex: Traumato-Ortopedia" />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
            <input
              type="checkbox"
              name="is_autonomo"
              id="modal_is_autonomo"
              checked={formData.is_autonomo}
              onChange={handleChange}
              className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
            />
            <label htmlFor="modal_is_autonomo" className="text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
              Profissional Autônomo (Parceiro)
            </label>
          </div>

          {/* BOTÕES */}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} 
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} 
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
              {isLoading ? 'Salvando...' : 'Cadastrar Profissional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}