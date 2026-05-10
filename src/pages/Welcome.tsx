import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, Loader2, Sparkles, Stethoscope } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';

export const Welcome: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await api.post('/password/forgot', { email });
      setResendSuccess(true);
      toast.success('E-mail de acesso enviado com sucesso!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao enviar e-mail. Verifique se o endereço está correto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="mb-8 flex justify-center">
          <div className="flex items-center group">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
              <Stethoscope className="text-white" size={28} />
            </div>
            <span className="text-slate-900 dark:text-white font-extrabold text-3xl tracking-tighter">
              somos<span className="text-blue-600">fisio</span>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden">
          {/* Confetti decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
          
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Assinatura Confirmada!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
              Obrigado por se juntar ao SomosFisio. Acabamos de enviar as instruções de acesso para o seu e-mail.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8 border border-blue-100 dark:border-blue-800/30">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Próximos passos
            </h3>
            <ol className="text-sm text-blue-800/80 dark:text-blue-200/80 space-y-3 ml-2 list-decimal list-inside font-medium">
              <li>Acesse a sua caixa de entrada do e-mail.</li>
              <li>Abra o e-mail enviado por nós (verifique o spam).</li>
              <li>Clique no link para criar sua senha.</li>
              <li>Comece a organizar sua clínica!</li>
            </ol>
          </div>

          {!resendSuccess ? (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-4">
              <p className="text-center text-sm font-bold text-slate-900 dark:text-white mb-4">
                Não encontrou o e-mail?
              </p>
              <form onSubmit={handleResend} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all text-sm font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-slate-900 hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-200 dark:shadow-none hover:shadow-blue-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Reenviar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
             <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-4 text-center">
               <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full text-sm font-bold">
                 <CheckCircle2 className="w-4 h-4" />
                 E-mail reenviado com sucesso!
               </div>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;
