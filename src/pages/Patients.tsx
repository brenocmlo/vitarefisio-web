import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, UserPlus, FileText, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatientFormModal } from '../components/PatientFormModal'; // Importando o modal
import { useAuth } from '../hooks/useAuth';

interface Patient {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  convenio?: string;
}

export function Patients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/fechar o modal

  async function loadPatients() {
    try {
      setLoading(true);
      const response = await api.get('/pacientes', {
        params: { clinica_id: user?.clinica_id }
      });
      setPatients(response.data);
    } catch (error) {
      console.error("Erro ao carregar pacientes", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
          <p className="text-slate-500 text-sm">Gerencie o histórico e dados dos seus clientes.</p>
        </div>
        
        {/* Agora o botão abre o modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm shadow-blue-200"
        >
          <UserPlus className="w-5 h-5" />
          Novo Paciente
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou CPF..."
          className="flex-1 outline-none text-slate-600 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nome</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">CPF</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Convênio</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Carregando pacientes...</td></tr>
              ) : filteredPatients.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Nenhum paciente encontrado.</td></tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{patient.nome}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{patient.cpf}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{patient.telefone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${patient.convenio ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {patient.convenio || 'Particular'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link 
                          to={`/pacientes/${patient.id}/prontuario`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver Prontuário"
                        >
                          <FileText className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lateral */}
      <PatientFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadPatients} 
      />
    </div>
  );
}