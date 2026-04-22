import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Search, UserPlus, FileText, MoreVertical, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatientFormModal } from '../components/PatientFormModal';
import { useAuth } from '../hooks/useAuth';

interface Patient {
  id: number;
  nome: string;
  cpf: string;
  contato_whatsapp: string;
  convenio_nome?: string;
}

export function Patients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadPatients() {
    try {
      setLoading(true);
      const response = await api.get('/pacientes', {
        params: { clinica_id: user?.clinica_id },
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, [user?.clinica_id]);

  const filteredPatients = useMemo(
    () =>
      patients.filter(
        (patient) =>
          patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) || patient.cpf.includes(searchTerm)
      ),
    [patients, searchTerm]
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-panel p-6 sm:p-7">
          <p className="eyebrow mb-3">Pacientes</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
            Uma base organizada para acompanhar cada jornada terapêutica.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            Consulte rapidamente cadastros, encontre prontuários com menos esforço e mantenha convênios e contatos sempre acessíveis.
          </p>
        </div>

        <div className="surface-card grid gap-4 p-6 sm:grid-cols-2">
          <InfoPill icon={Users} label="Total cadastrado" value={String(patients.length)} />
          <InfoPill icon={ShieldCheck} label="Convênios ativos" value={String(patients.filter((item) => item.convenio_nome).length)} />
        </div>
      </section>

      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="surface-muted flex items-center gap-3 px-4 py-3 lg:min-w-[380px]">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou CPF..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={() => setIsModalOpen(true)} className="primary-button">
          <UserPlus className="h-4 w-4" />
          Novo paciente
        </button>
      </section>

      <section className="table-shell">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="table-head">
              <tr className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">CPF</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Convênio</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-sm text-slate-500 dark:text-slate-400">
                    Carregando pacientes...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16">
                    <div className="mx-auto flex max-w-md flex-col items-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
                        <Users className="h-7 w-7" />
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Nenhum paciente encontrado.</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Ajuste a busca ou crie um novo cadastro para iniciar o acompanhamento.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="table-row">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{patient.nome}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Prontuário disponível para consulta</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{patient.cpf}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{patient.contato_whatsapp || '—'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          patient.convenio_nome
                            ? 'bg-sky-500/10 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300'
                            : 'bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {patient.convenio_nome || 'Particular'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/pacientes/${patient.id}/prontuario`}
                          className="icon-button h-10 w-10"
                          title="Ver prontuário"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>
                        <button className="icon-button h-10 w-10" title="Mais opções">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <PatientFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadPatients} />
    </div>
  );
}

function InfoPill({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="surface-muted p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[18px] bg-sky-500/10 text-sky-700 dark:bg-sky-400/12 dark:text-sky-300">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 font-display text-2xl font-extrabold text-slate-950 dark:text-slate-50">{value}</p>
    </div>
  );
}
