import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Sliders
} from 'lucide-react';
import { Language } from '../types';
import { BudgetAlertInfo, getAlertCopy } from '../utils/budgetMonitor';

interface BudgetAlertBannerProps {
  budgetInfo: BudgetAlertInfo;
  language: Language;
  onAskGuru: (prompt: string) => void;
  onNavigateToTools?: () => void;
  onSimulateThreshold?: (percentage: number) => void;
}

export const BudgetAlertBanner: React.FC<BudgetAlertBannerProps> = ({
  budgetInfo,
  language,
  onAskGuru,
  onNavigateToTools,
  onSimulateThreshold
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSimModal, setShowSimModal] = useState(false);

  const copy = getAlertCopy(budgetInfo, language);
  const { level, percentage, totalSpent, monthlyAllowance, remaining } = budgetInfo;

  if (monthlyAllowance <= 0) {
    return null;
  }

  const isExceeded = level === 'exceeded';
  const isCritical = level === 'critical';
  const isWarning = level === 'warning';
  const isAlertState = isExceeded || isCritical || isWarning;

  // Color & icon themes
  const theme = isExceeded
    ? {
        containerBg: 'bg-gradient-to-br from-[#241010] via-[#1a0e0e] to-[#121110]',
        borderColor: 'border-red-500/30',
        glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
        badgeBg: 'bg-red-500/15 text-red-400 border border-red-500/30',
        accentText: 'text-red-400',
        progressFill: 'bg-red-500',
        pulseGlow: 'bg-red-500/20',
        Icon: Flame,
      }
    : isCritical
    ? {
        containerBg: 'bg-gradient-to-br from-[#24170d] via-[#1c130d] to-[#121110]',
        borderColor: 'border-orange-500/30',
        glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
        badgeBg: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
        accentText: 'text-orange-400',
        progressFill: 'bg-orange-500',
        pulseGlow: 'bg-orange-500/20',
        Icon: AlertOctagon,
      }
    : isWarning
    ? {
        containerBg: 'bg-gradient-to-br from-[#221c10] via-[#1a1710] to-[#121110]',
        borderColor: 'border-[#D0BB95]/30',
        glow: 'shadow-[0_0_30px_rgba(208,187,149,0.15)]',
        badgeBg: 'bg-[#D0BB95]/15 text-[#D0BB95] border border-[#D0BB95]/30',
        accentText: 'text-[#D0BB95]',
        progressFill: 'bg-[#D0BB95]',
        pulseGlow: 'bg-[#D0BB95]/20',
        Icon: AlertTriangle,
      }
    : {
        containerBg: 'bg-[#121110]',
        borderColor: 'border-white/5',
        glow: 'shadow-xl',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        accentText: 'text-emerald-400',
        progressFill: 'bg-emerald-500',
        pulseGlow: 'bg-emerald-500/10',
        Icon: ShieldCheck,
      };

  const { Icon } = theme;

  return (
    <section className={`rounded-[2.5rem] p-6 sm:p-7 border ${theme.borderColor} ${theme.containerBg} ${theme.glow} transition-all duration-300 relative overflow-hidden`}>
      {/* Background radial highlight */}
      <div className={`absolute -right-16 -top-16 size-48 rounded-full blur-[80px] pointer-events-none ${theme.pulseGlow}`} />

      {/* Header Bar */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className={`size-12 rounded-2xl ${theme.badgeBg} flex items-center justify-center shrink-0 shadow-lg`}>
            <Icon className={`w-6 h-6 ${theme.accentText} ${isAlertState ? 'animate-pulse' : ''}`} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full ${theme.badgeBg}`}>
                {copy.badge}
              </span>
              {isAlertState && (
                <span className="flex size-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.progressFill}`}></span>
                  <span className={`relative inline-flex rounded-full size-2 ${theme.progressFill}`}></span>
                </span>
              )}
            </div>
            <h3 className="text-white text-lg sm:text-xl font-black tracking-tight uppercase">
              {copy.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick simulator modal toggle for testing thresholds */}
          {onSimulateThreshold && (
            <button
              onClick={() => setShowSimModal(!showSimModal)}
              title="Test threshold levels (80%, 90%, 100%)"
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-wider border border-white/5 flex items-center gap-1 transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Test Alert</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="size-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label={isExpanded ? 'Collapse alert' : 'Expand alert'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Threshold Simulator Controls (Quick dropdown) */}
      {showSimModal && onSimulateThreshold && (
        <div className="mt-4 p-3.5 rounded-2xl bg-black/60 border border-white/10 relative z-20 space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Simulate Threshold Level:</span>
            <button 
              onClick={() => setShowSimModal(false)}
              className="text-slate-500 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Normal (50%)', pct: 50, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
              { label: '80% Alert', pct: 82, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
              { label: '90% Alert', pct: 93, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
              { label: '100% Limit', pct: 105, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
            ].map(item => (
              <button
                key={item.pct}
                onClick={() => {
                  onSimulateThreshold(item.pct);
                  setShowSimModal(false);
                }}
                className={`py-2 px-1 text-center rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all hover:scale-105 active:scale-95 ${item.color}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-5 space-y-5 relative z-10">
          {/* Progress Bar with 80% & 90% Threshold Markers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                {language === 'HIN' ? 'मासिक भत्ता उपयोग' : 'Allowance Consumption'}
              </span>
              <span className={`text-sm ${theme.accentText}`}>
                {percentage}% ({percentage >= 100 ? (language === 'HIN' ? 'सीमा पार' : 'Exceeded') : `${100 - percentage}% left`})
              </span>
            </div>

            <div className="relative h-3.5 w-full bg-[#1e1c18] rounded-full overflow-hidden p-0.5 border border-white/5">
              {/* 80% and 90% milestone indicators */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/70 z-20" 
                style={{ left: '80%' }}
                title="80% Warning Threshold"
              />
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-orange-500/80 z-20" 
                style={{ left: '90%' }}
                title="90% Critical Threshold"
              />

              {/* Progress bar fill */}
              <div 
                className={`h-full rounded-full transition-all duration-700 ${theme.progressFill}`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>

            {/* Threshold Labels under progress bar */}
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-black uppercase tracking-widest px-1">
              <span>₹0</span>
              <span className="text-yellow-400/80">80% Threshold</span>
              <span className="text-orange-400/80">90% Critical</span>
              <span>₹{monthlyAllowance.toLocaleString()}</span>
            </div>
          </div>

          {/* Key Figures Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#181613] p-3.5 rounded-2xl border border-white/5">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">
                {language === 'HIN' ? 'कुल खर्च' : 'Total Spent'}
              </span>
              <p className="text-white text-base font-black">₹{totalSpent.toLocaleString()}</p>
            </div>

            <div className="bg-[#181613] p-3.5 rounded-2xl border border-white/5">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">
                {language === 'HIN' ? 'शेष भत्ता' : 'Remaining'}
              </span>
              <p className={`text-base font-black ${isExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
                ₹{remaining.toLocaleString()}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-[#181613] p-3.5 rounded-2xl border border-white/5">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">
                {language === 'HIN' ? 'मासिक बजट' : 'Allowance'}
              </span>
              <p className="text-primary text-base font-black">₹{monthlyAllowance.toLocaleString()}</p>
            </div>
          </div>

          {/* Description & Guru Recommendation */}
          <div className="bg-black/30 rounded-2xl p-4 border border-white/5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="text-slate-300 font-medium leading-relaxed">
                {copy.desc}
              </p>
              <p className={`font-black italic text-xs ${theme.accentText}`}>
                {copy.guruAdvice}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <button
              onClick={() => onAskGuru(copy.chatPrompt)}
              className={`w-full sm:flex-1 py-3.5 px-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                isAlertState 
                  ? 'bg-primary text-background-dark shadow-primary/20 hover:brightness-110' 
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <span>{copy.btnText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onNavigateToTools && (
              <button
                onClick={onNavigateToTools}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-black text-xs uppercase tracking-widest border border-white/5 transition-colors"
              >
                {language === 'HIN' ? 'भत्ता बदलें' : 'Adjust Allowance'}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default BudgetAlertBanner;
