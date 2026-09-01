import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, AlertOctagon, Flame, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { BudgetToastData } from '../utils/budgetMonitor';

interface BudgetToastProps {
  toast: BudgetToastData | null;
  onDismiss: () => void;
  onAction?: (query: string) => void;
}

export const BudgetToast: React.FC<BudgetToastProps> = ({ toast, onDismiss, onAction }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;
    setProgress(100);

    const startTime = Date.now();
    const duration = 6500; // 6.5s auto-dismiss

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isExceeded = toast.level === 'exceeded';
  const isCritical = toast.level === 'critical';
  const isWarning = toast.level === 'warning';

  const themeConfig = isExceeded
    ? {
        bg: 'bg-[#181111]',
        border: 'border-red-500/40',
        glow: 'shadow-[0_12px_40px_rgba(239,68,68,0.25)]',
        badgeBg: 'bg-red-500/15 text-red-400 border border-red-500/30',
        progressBar: 'bg-red-500',
        iconColor: 'text-red-400',
        Icon: Flame,
      }
    : isCritical
    ? {
        bg: 'bg-[#181210]',
        border: 'border-orange-500/40',
        glow: 'shadow-[0_12px_40px_rgba(249,115,22,0.25)]',
        badgeBg: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
        progressBar: 'bg-orange-500',
        iconColor: 'text-orange-400',
        Icon: AlertOctagon,
      }
    : {
        bg: 'bg-[#161512]',
        border: 'border-[#D0BB95]/40',
        glow: 'shadow-[0_12px_40px_rgba(208,187,149,0.2)]',
        badgeBg: 'bg-[#D0BB95]/15 text-[#D0BB95] border border-[#D0BB95]/30',
        progressBar: 'bg-[#D0BB95]',
        iconColor: 'text-[#D0BB95]',
        Icon: AlertTriangle,
      };

  const { Icon } = themeConfig;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="fixed top-5 left-1/2 -translate-x-1/2 md:top-6 md:right-6 md:left-auto md:translate-x-0 z-[100] w-[92%] sm:w-[420px] max-w-md pointer-events-auto"
      >
        <div className={`relative overflow-hidden rounded-2xl ${themeConfig.bg} ${themeConfig.border} border ${themeConfig.glow} backdrop-blur-2xl p-4 sm:p-5 shadow-2xl`}>
          {/* Top auto-dismiss timer bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
            <div 
              className={`h-full ${themeConfig.progressBar} transition-all duration-75`} 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-start gap-3.5 pt-1">
            {/* Icon badge */}
            <div className={`size-10 rounded-xl ${themeConfig.badgeBg} flex items-center justify-center shrink-0 shadow-inner`}>
              <Icon className={`w-5 h-5 ${themeConfig.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${themeConfig.badgeBg}`}>
                  {toast.threshold}% THRESHOLD
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {toast.percentage}% used
                </span>
              </div>

              <h4 className="text-white text-sm font-black tracking-tight uppercase leading-snug">
                {toast.title}
              </h4>

              <p className="text-slate-300 text-xs mt-1 leading-relaxed line-clamp-2">
                {toast.message}
              </p>

              {/* Progress and numbers */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Spent: </span>
                  <span className="text-white font-black">₹{toast.spent.toLocaleString()}</span>
                  <span className="text-slate-500 font-normal"> / ₹{toast.allowance.toLocaleString()}</span>
                </div>

                {onAction && (
                  <button
                    onClick={() => {
                      const prompt = isExceeded
                        ? "Guru, I exceeded 100% of my monthly budget. Give me an immediate action plan to cut costs."
                        : `Guru, I reached ${toast.threshold}% of my allowance. What should I prioritize for the remaining ₹${toast.remaining.toLocaleString()}?`;
                      onAction(prompt);
                      onDismiss();
                    }}
                    className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider ${themeConfig.iconColor} hover:underline transition-all`}
                  >
                    <span>Ask Guru</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onDismiss}
              className="size-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BudgetToast;
