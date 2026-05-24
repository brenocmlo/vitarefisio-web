import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock3,
  Layers,
  Loader2,
  XCircle,
  Plus
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

interface TimeSlotCardProps {
  hour: number;
  slotApps: any[];
  onStatusChange: (id: number, status: string) => void;
  onCancel: (id: number) => void;
  onOpenModal: (time: string) => void;
  isCancelPending: boolean;
  cancelPendingId: number | null;
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = memo(({
  hour,
  slotApps,
  onStatusChange,
  onCancel,
  onOpenModal,
  isCancelPending,
  cancelPendingId,
}) => {
  const timeString = `${hour.toString().padStart(2, '0')}:00`;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className="surface-card min-h-[220px] p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Horário</p>
          <h3 className="font-display text-2xl font-extrabold text-slate-950 dark:text-slate-50">{timeString}</h3>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
          <Clock3 className="h-5 w-5" />
        </div>
      </div>

      {slotApps.length > 0 ? (
        <div className="space-y-3">
          {slotApps.map((app: any) => {
            const isDone = app.status === 'realizado';
            const statusStyles = isDone
              ? 'border-emerald-300/60 bg-emerald-500/10 dark:border-emerald-400/20 dark:bg-emerald-400/10'
              : 'border-sky-300/60 bg-sky-500/10 dark:border-sky-400/20 dark:bg-sky-400/10';

            return (
              <div key={app.id} className={`rounded-[22px] border p-4 ${statusStyles}`}>
                {app.pacote_paciente_id && (
                  <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                    <Layers size={10} />
                    Sessão via Pacote
                  </div>
                )}
                <Link
                  to={`/pacientes/${app.paciente_id}/prontuario`}
                  className="block text-sm font-bold text-slate-900 hover:text-sky-700 dark:text-slate-100 dark:hover:text-sky-300"
                >
                  {app.paciente?.nome}
                </Link>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Acompanhe evolução e detalhes do atendimento.</p>
                <select
                  value={app.status}
                  onChange={(e) => onStatusChange(app.id, e.target.value)}
                  className="select-shell mt-4 py-2 text-xs font-bold uppercase tracking-[0.16em]"
                >
                  <option value="agendado">Agendado</option>
                  <option value="realizado">Realizado</option>
                  <option value="faltou">Faltou</option>
                </select>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const response = await api.post(`/agendamentos/${app.id}/reminder`);
                        if (response.data.link_whatsapp) {
                          window.open(response.data.link_whatsapp, '_blank');
                        }
                      } catch (error: any) {
                        toast.error(error.response?.data?.error || 'Erro ao gerar link do WhatsApp.');
                      }
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2.5 text-center text-xs font-bold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Lembrete WhatsApp
                  </button>
                  <Link
                    to={`/pacientes/${app.paciente_id}/prontuario`}
                    className="secondary-button w-full justify-center px-3 py-2.5 text-center text-xs"
                  >
                    Ver prontuário
                  </Link>
                  <button
                    type="button"
                    onClick={() => onCancel(app.id)}
                    disabled={isCancelPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-center text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200 dark:hover:bg-red-400/15"
                  >
                    {isCancelPending && cancelPendingId === app.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 shrink-0" />
                        <span className="whitespace-normal break-words leading-4">Cancelar agendamento</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <button
          onClick={() => onOpenModal(timeString)}
          className="flex h-[130px] w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/40 text-slate-400 transition-all hover:border-sky-300 hover:bg-sky-500/5 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950/20 dark:hover:border-sky-500 dark:hover:bg-sky-400/5 dark:hover:text-sky-300"
        >
          <Plus className="mb-2 h-5 w-5" />
          <span className="text-sm font-semibold">Adicionar encaixe</span>
        </button>
      )}
    </motion.div>
  );
});
