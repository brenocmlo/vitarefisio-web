import React, { useEffect, useState } from 'react';
import { UserPlus, ShieldCheck, Mail, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import { FisioterapeutaFormModal } from '../components/FisioterapeutaFormModal';
import { useAuth } from '../hooks/useAuth';

export function Staff() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [team, setTeam] = useState([]);

  async function loadTeam() {
    try {
      // Busca os usuários. Ajuste a rota se o seu backend usar outro caminho, ex: '/usuarios'
      const response = await api.get('/fisioterapeutas'); 
      setTeam(response.data);
    } catch (error) {
      console.error("Erro ao carregar equipe");
    }
  }

  useEffect(() => { loadTeam(); }, []);

    async function handleRemoveMember(id: number, nome: string) {
    if (id === user?.id) {
      toast.error('Você não pode remover o seu próprio acesso de Administrador.');
      return;
}

    const confirmed = window.confirm(`Tem certeza que deseja remover o acesso de ${nome}? Esta ação revogará o acesso dele ao sistema imediatamente.`);
    
    if (confirmed) {
      try {
        await api.delete(`/fisioterapeutas/${id}`);
        toast.success('Profissional removido e acesso revogado!');
        loadTeam(); 
      } catch (error: any) {
        // ✨ A MÁGICA ESTÁ AQUI: Lendo o '.error' em vez de '.message'
        const backendError = error.response?.data?.error || error.response?.data?.message || 'Erro ao remover profissional.';
        toast.error(backendError);
        console.error("Erro completo:", error.response?.data);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Minha Equipe</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie os profissionais da sua clínica.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="primary-button">
          <UserPlus className="h-4 w-4" />
          Adicionar Profissional
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member: any) => (
          <div key={member.id} className="surface-panel p-5 flex items-start gap-4 relative group">
            <div className="h-12 w-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-lg">
              {member.nome.charAt(0)}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 dark:text-slate-50 truncate">{member.nome}</h3>
              <div className="mt-1 space-y-1">
                <p className="text-xs text-slate-500 flex items-center gap-1.5"><Mail className="h-3 w-3" /> {member.email}</p>
                <div className="flex items-center gap-2">
                   <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10">
                    <ShieldCheck className="h-3 w-3" /> {member.tipo === 'admin' ? 'Administrador' : 'Fisioterapeuta'}
                  </span>
                </div>
              </div>
            </div>

            {/* BOTÃO DE REMOVER (Só aparece ao passar o mouse ou em telas menores) */}
            {member.id !== user?.id && (
              <button 
                onClick={() => handleRemoveMember(member.id, member.nome)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                title="Revogar Acesso"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <FisioterapeutaFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadTeam} 
      />
    </div>
  );
}