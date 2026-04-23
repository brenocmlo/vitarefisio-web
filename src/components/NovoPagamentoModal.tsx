import React, { useState } from 'react';
import { X, Search, Package, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

interface NovoPagamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NovoPagamentoModal({ isOpen, onClose, onSuccess }: NovoPagamentoModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Tipo de Lançamento (Avulso vs Pacote)
  const [tipoLancamento, setTipoLancamento] = useState<'avulso' | 'pacote'>('avulso');

  // Estados dos campos de Paciente
  const [cpf, setCpf] = useState('');
  const [nomePaciente, setNomePaciente] = useState('');
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  
  // Estados do Formulário Financeiro
  const [formData, setFormData] = useState({
    valor: '',
    metodo_pagamento: 'pix',
    status: 'pago',
    // Campos específicos para Pacotes
    nome_pacote: 'Pacote 10 Sessões', 
    qtd_sessoes: '10'
  });

  if (!isOpen) return null;

  // Busca o paciente ao sair do campo CPF
  async function handleCpfBlur() {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) {
      if (cleanCpf.length > 0) toast.error('O CPF precisa ter 11 dígitos.');
      return;
    }

    setIsSearching(true);
    setNomePaciente('Buscando paciente...');
    
    try {
      const response = await api.get(`/pacientes/cpf/${cleanCpf}`);
      const paciente = response.data;
      
      setNomePaciente(paciente.nome);
      setPacienteId(paciente.id); 
      toast.success('Paciente localizado com sucesso!');
    } catch (error: any) {
      setNomePaciente('');
      setPacienteId(null);
      toast.error(error.response?.data?.error || 'Paciente não encontrado.');
    } finally {
      setIsSearching(false);
    }
  }

  // Máscara de CPF
  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    setCpf(value);
  }

  // Enviando o pagamento para o banco
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!pacienteId) {
      toast.error('Você precisa informar um CPF válido para identificar o paciente.');
      return;
    }

    setIsLoading(true);

    try {
      // Prepara os dados base
      const payload: any = {
        paciente_id: pacienteId,
        valor: Number(formData.valor),
        metodo_pagamento: formData.metodo_pagamento,
        status: formData.status,
      };

      // Se for pacote, você pode adaptar aqui para enviar para a rota de pacotes do seu backend,
      // ou enviar variáveis extras na mesma rota de pagamento.
      if (tipoLancamento === 'pacote') {
        payload.is_pacote = true;
        payload.nome_pacote = formData.nome_pacote;
        payload.qtd_sessoes = Number(formData.qtd_sessoes);
        
        // Exemplo: Se você tiver uma rota específica para pacotes, mude aqui:
        // await api.post(`/pacientes/${pacienteId}/pacotes`, payload);
      } 
      
      // Envio padrão
      await api.post('/pagamentos', payload);

      toast.success(tipoLancamento === 'pacote' ? 'Pacote vendido com sucesso!' : 'Pagamento lançado com sucesso!');
      
      // Limpa os dados e fecha
      setCpf('');
      setNomePaciente('');
      setPacienteId(null);
      setFormData({ valor: '', metodo_pagamento: 'pix', status: 'pago', nome_pacote: 'Pacote 10 Sessões', qtd_sessoes: '10' });
      setTipoLancamento('avulso');
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao processar a operação.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Novo Recebimento</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ALTERNADOR: AVULSO VS PACOTE */}
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-700/50">
            <button
              type="button"
              onClick={() => setTipoLancamento('avulso')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                tipoLancamento === 'avulso' 
                  ? 'bg-white text-sky-600 shadow-sm dark:bg-slate-600 dark:text-sky-400' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Stethoscope size={16} />
              Sessão Avulsa
            </button>
            <button
              type="button"
              onClick={() => setTipoLancamento('pacote')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                tipoLancamento === 'pacote' 
                  ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-600 dark:text-emerald-400' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Package size={16} />
              Venda de Pacote
            </button>
          </div>
          
          {/* BUSCA INTELIGENTE */}
          <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CPF do Paciente</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={cpf}
                  onChange={handleCpfChange}
                  onBlur={handleCpfBlur}
                  required
                  placeholder="000.000.000-00"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-10 text-sm placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isSearching ? 'text-sky-500 animate-pulse' : 'text-slate-400'}`} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Paciente</label>
              <input 
                type="text" 
                value={nomePaciente}
                readOnly
                placeholder="Preenchimento automático"
                className="block w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400"
              />
            </div>
          </div>

          {/* CAMPOS EXCLUSIVOS DE PACOTE (Só aparece se clicar em Pacote) */}
          {tipoLancamento === 'pacote' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Paciente</label>
                <input 
                  type="text" 
                  required
                  value={formData.nome_pacote}
                  onChange={(e) => setFormData({ ...formData, nome_pacote: e.target.value })}
                  placeholder="Ex: Pós-Operatório"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Qtd. Sessões</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={formData.qtd_sessoes}
                  onChange={(e) => setFormData({ ...formData, qtd_sessoes: e.target.value })}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* DADOS DO PAGAMENTO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor Total (R$)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                required
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder={tipoLancamento === 'pacote' ? "1500.00" : "150.00"}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Método</label>
              <select 
                value={formData.metodo_pagamento}
                onChange={(e) => setFormData({ ...formData, metodo_pagamento: e.target.value })}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="pix">PIX</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status do Recebimento</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="pago">Recebido (Caiu na conta)</option>
                <option value="pendente">Pendente (Aguardando)</option>
              </select>
          </div>

          {/* BOTÕES */}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !pacienteId} 
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                tipoLancamento === 'pacote' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              {isLoading ? 'Salvando...' : tipoLancamento === 'pacote' ? 'Vender Pacote' : 'Confirmar Recebimento'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}