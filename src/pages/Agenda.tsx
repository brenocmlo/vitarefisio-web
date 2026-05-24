import { useState, useMemo, useEffect, useCallback, Suspense, lazy } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';
import { toast } from 'sonner';

const AppointmentFormModal = lazy(() =>
  import('../components/AppointmentFormModal').then(module => ({ default: module.AppointmentFormModal }))
);
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from '../components/Skeleton';
import { motion } from 'framer-motion';
import { AnimatedPage } from '../components/AnimatedPage';

// Sub-components
import { AgendaHeader } from '../components/agenda/AgendaHeader';
import { TimeSlotCard } from '../components/agenda/TimeSlotCard';
import { MonthCalendar } from '../components/agenda/MonthCalendar';

export function Agenda() {
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState('08:00');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('google_sync') === 'success') {
      toast.success('Agenda sincronizada com o Google Calendar!', {
        description: 'Seus próximos agendamentos serão enviados automaticamente.',
      });
      searchParams.delete('google_sync');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const queryClient = useQueryClient();
  const queryKey = ['agendamentos', viewMode, format(selectedDate, 'yyyy-MM-dd')];

  const fetchAppointments = async () => {
    const params: any = {};
    if (viewMode === 'day') {
      params.data = format(selectedDate, 'yyyy-MM-dd');
    } else {
      params.mes = format(selectedDate, 'MM');
      params.ano = format(selectedDate, 'yyyy');
    }
    const response = await api.get('/agendamentos', { params });
    const data = Array.isArray(response.data) ? response.data : [];
    return data.filter((app: any) => app.status !== 'cancelado');
  };

  const { data: appointments = [], isLoading } = useQuery({
    queryKey,
    queryFn: fetchAppointments,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      api.patch(`/agendamentos/${id}/status`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => 
        old?.map((app: any) => app.id === id ? { ...app, status } : app)
      );
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error('Erro ao atualizar status.');
    },
    onSuccess: () => toast.success('Status atualizado!'),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/agendamentos/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => 
        old?.filter((app: any) => app.id !== id)
      );
      return { previousData };
    },
    onError: (err: any, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(err?.response?.data?.message || 'Erro ao cancelar.');
    },
    onSuccess: () => toast.success('Agendamento cancelado com sucesso.'),
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(selectedDate)),
      end: endOfWeek(endOfMonth(selectedDate)),
    });
  }, [selectedDate]);

  const appointmentsByDay = useMemo(() => {
    return calendarDays.reduce<Record<string, any[]>>((acc, day) => {
      const key = format(day, 'yyyy-MM-dd');
      acc[key] = appointments.filter((appointment: any) => {
        const appDate = new Date(appointment.data_hora);
        const keyLocal = format(appDate, 'yyyy-MM-dd');
        return keyLocal === key;
      });
      return acc;
    }, {});
  }, [appointments, calendarDays]);

  const handleStatusChange = useCallback((agendamentoId: number, novoStatus: string) => {
    statusMutation.mutate({ id: agendamentoId, status: novoStatus });
  }, [statusMutation]);

  const handleCancelAppointment = useCallback((agendamentoId: number) => {
    cancelMutation.mutate(agendamentoId);
  }, [cancelMutation]);

  const handleOpenModal = useCallback((hora: string) => {
    setSelectedHour(hora);
    setIsModalOpen(true);
  }, []);

  const handleConnectGoogle = useCallback(async () => {
    try {
      const response = await api.get('/google/auth');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error('Erro ao conectar com Google Calendar.');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[120px] w-full rounded-[32px]" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Skeleton key={i} className="h-[220px] w-full rounded-[32px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <AgendaHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onConnectGoogle={handleConnectGoogle}
          onOpenModal={handleOpenModal}
        />

        {viewMode === 'day' ? (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.03 } }
            }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5"
          >
            {Array.from({ length: 11 }, (_, i) => i + 8).map((hour) => {
              const slotApps = appointments.filter((appointment: any) => {
                if (!appointment.data_hora) return false;
                const appDate = new Date(appointment.data_hora);
                const appHour = appDate.getHours();
                return appHour === hour;
              });

              return (
                <TimeSlotCard
                  key={hour}
                  hour={hour}
                  slotApps={slotApps}
                  onStatusChange={handleStatusChange}
                  onCancel={handleCancelAppointment}
                  onOpenModal={handleOpenModal}
                  isCancelPending={cancelMutation.isPending}
                  cancelPendingId={cancelMutation.variables ?? null}
                />
              );
            })}
          </motion.section>
        ) : (
          <MonthCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setViewMode={setViewMode}
            calendarDays={calendarDays}
            appointmentsByDay={appointmentsByDay}
          />
        )}

        <Suspense fallback={null}>
          <AppointmentFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
            }}
            selectedDate={selectedDate}
            defaultHour={selectedHour}
          />
        </Suspense>
      </div>
    </AnimatedPage>
  );
}
