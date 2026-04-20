import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { 
  Users, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  UserX,
  Clock,
  ExternalLink,
  UserPlus,
  CalendarPlus,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { PatientFormModal } from '../components/PatientFormModal';
import { AppointmentFormModal } from '../components/AppointmentFormModal';

interface Metrics {
  hoje: {
    total_agendamentos: number;
    proximos_pacientes: any[];
  };
  mes: {
    pacientes_ativos: number;
    sessoes_realizadas: number;
    taxa_de_faltas_percentual: string | number;
    faturamento_estimado: number;
  };
}

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // O clinica_id agora vem corretamente do perfil do usuário logado
        const response = await api.get(`/dashboard?clinica_id=${user?.clinica_id}`);
        setMetrics(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando métricas...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho de Boas-vindas */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Olá, Dr. {user?.nome}</h1>
        <p className="text-slate-500 text-sm">Aqui está o resumo da sua clínica para hoje, {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}.</p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Pacientes Ativos" 
          value={metrics?.mes.pacientes_ativos || 0} 
          icon={Users} 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
        <Card 
          title="Agendamentos Hoje" 
          value={metrics?.hoje.total_agendamentos || 0} 
          icon={CalendarIcon} 
          color="text-emerald-600" 
          bg="bg-emerald-50" 
        />
        <Card 
          title="Faturamento (Mês)" 
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics?.mes.faturamento_estimado || 0)} 
          icon={TrendingUp} 
          color="text-violet-600" 
          bg="bg-violet-50" 
        />
        <Card 
          title="Taxa de Faltas" 
          value={`${metrics?.mes.taxa_de_faltas_percentual || 0}%`} 
          icon={UserX} 
          color="text-orange-600" 
          bg="bg-orange-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Próximos Atendimentos */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Próximos Atendimentos
            </h3>
            <button className="text-sm text-blue-600 hover:underline">Ver agenda completa</button>
          </div>
          
          <div className="divide-y divide-slate-50">
            {metrics?.hoje.proximos_pacientes.length === 0 ? (
              <div className="p-10 text-center text-slate-400">Nenhum agendamento para o resto do dia.</div>
            ) : (
              metrics?.hoje.proximos_pacientes.map((item: any) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                      {format(new Date(item.data_hora), 'HH:mm')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Paciente #{item.paciente_id}</p>
                      <p className="text-xs text-slate-500 uppercase">{item.status}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200 transition-all">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card Auxiliar / Atalhos Rápidos */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
            <h3 className="font-bold mb-2">Atalhos Rápidos</h3>
            <p className="text-blue-100 text-sm mb-6">Ações frequentes para agilizar o seu dia a dia.</p>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setIsPatientModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-3"
              >
                <UserPlus className="w-4 h-4" />
                Novo Paciente
              </button>
              <button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-3"
              >
                <CalendarPlus className="w-4 h-4" />
                Novo Agendamento
              </button>
              <button 
                onClick={() => navigate('/financeiro')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-3"
              >
                <DollarSign className="w-4 h-4" />
                Lançar Pagamento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modais dos Atalhos Rápidos */}
      <PatientFormModal 
        isOpen={isPatientModalOpen} 
        onClose={() => setIsPatientModalOpen(false)} 
        onSuccess={() => { setIsPatientModalOpen(false); }} 
      />
      <AppointmentFormModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
        onSuccess={() => { setIsAppointmentModalOpen(false); }} 
        selectedDate={new Date()} 
      />
    </div>
  );
}

// Sub-componente interno para os Cards
function Card({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
    </div>
  );
}