import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const SubscriptionInactive: React.FC = () => {
  const { signOut } = useAuth();

  // Substitua pela sua URL real de checkout da Kiwify
  const kiwifyCheckoutUrl = "https://pay.kiwify.com.br/seu-link-aqui";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100/30 dark:bg-amber-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 text-center relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Assinatura Inativa
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">
          Notamos que o seu plano atual encontra-se suspenso ou cancelado. Para voltar a utilizar todas as ferramentas do VitareFisio, regularize sua assinatura.
        </p>

        <div className="space-y-3">
          <a
            href={kiwifyCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-amber-200 active:scale-95 flex items-center justify-center gap-2"
          >
            Reativar Assinatura
            <ArrowRight className="w-4 h-4" />
          </a>
          
          <button
            onClick={signOut}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionInactive;
