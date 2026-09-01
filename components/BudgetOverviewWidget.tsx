import React, { useState } from 'react';
import { 
  Calendar, 
  Wallet, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Flame, 
  ShieldCheck,
  Sparkles, 
  ArrowRight, 
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Transaction, Language } from '../types';
import { calculateBudgetStatus } from '../utils/budgetMonitor';

interface BudgetOverviewWidgetProps {
  transactions: Transaction[];
  monthlyAllowance: number;
  language: Language;
  onNavigateToTools?: () => void;
  onAskGuru: (prompt: string) => void;
  onSimulateThreshold?: (percentage: number) => void;
}

export const BudgetOverviewWidget: React.FC<BudgetOverviewWidgetProps> = ({
  transactions,
  monthlyAllowance,
  language,
  onNavigateToTools,
  onAskGuru,
  onSimulateThreshold
}) => {
  const [showSimModal, setShowSimModal] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const isHin = language === 'HIN';

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentDay = now.getDate();
  
  // Calculate total days in current month
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysRemaining = Math.max(1, totalDaysInMonth - currentDay);
  const daysPassed = currentDay;
  const timeElapsedPct = Math.round((daysPassed / totalDaysInMonth) * 100);

  const monthName = now.toLocaleString(isHin ? 'hi-IN' : 'en-US', { month: 'long' });

  // Calculate budget metrics
  const budgetInfo = calculateBudgetStatus(transactions, monthlyAllowance, language, now);
  const { totalSpent, remaining, percentage: budgetConsumedPct, level, isOverBudget } = budgetInfo;
  const allowance = Number(monthlyAllowance) || 0;

  // Daily budget calculations
  const dailyBurnRateSoFar = daysPassed > 0 ? Math.round(totalSpent / daysPassed) : totalSpent;
  const safeDailyAllowance = Math.round(remaining / daysRemaining);

  // Compare budget spent % vs calendar time elapsed %
  const paceDifference = budgetConsumedPct - timeElapsedPct;

  // Determine overall unified status & style theme
  const isExceeded = level === 'exceeded';
  const isCritical = level === 'critical';
  const isWarning = level === 'warning';
  const isThresholdAlert = isExceeded || isCritical || isWarning;

  let statusBadge = '';
  let statusTitle = '';
  let statusTagline = '';
  let guruAdvice = '';
  let chatPrompt = '';

  if (isExceeded) {
    statusBadge = isHin ? '⚠️ 100% सीमा पार' : '⚠️ 100% LIMIT EXCEEDED';
    statusTitle = isHin ? `मासिक भत्ता समाप्त (${budgetConsumedPct}%)` : `Allowance Exceeded (${budgetConsumedPct}%)`;
    statusTagline = isHin 
      ? `महीने के ${daysRemaining} दिन बाकी हैं और बजट पूरा समाप्त हो चुका है!` 
      : `${daysRemaining} days left in ${monthName}, but allowance is 100% exhausted!`;
    guruAdvice = isHin 
      ? 'गुरु: भाई ब्रेक लगाओ! गैर-जरूरी खर्च तुरंत रोकें।' 
      : 'Guru: Emergency brake time! Freeze all non-essential purchases immediately.';
    chatPrompt = 'Guru, I have exceeded 100% of my monthly allowance. Give me an emergency recovery plan in witty Hinglish!';
  } else if (isCritical) {
    statusBadge = isHin ? '🚨 90% गंभीर चेतावनी' : '🚨 90% CRITICAL ALERT';
    statusTitle = isHin ? `बजट का 90% पार (${budgetConsumedPct}%)` : `90% Threshold Crossed (${budgetConsumedPct}%)`;
    statusTagline = isHin 
      ? `शेष ${daysRemaining} दिनों के लिए केवल ₹${remaining.toLocaleString()} बचे हैं।` 
      : `Only ₹${remaining.toLocaleString()} left for the remaining ${daysRemaining} days.`;
    guruAdvice = isHin 
      ? 'गुरु: खतरे की घंटी! सिर्फ अति-आवश्यक चीजें ही खरीदें।' 
      : 'Guru: Red zone entered! Stick strictly to essentials until month-end.';
    chatPrompt = 'Guru, I have used over 90% of my monthly allowance. What spending cuts should I make right now? Answer in Hinglish.';
  } else if (isWarning) {
    statusBadge = isHin ? '⚡ 80% बजट चेतावनी' : '⚡ 80% BUDGET ALERT';
    statusTitle = isHin ? `80% बजट सीमा पर (${budgetConsumedPct}%)` : `80% Threshold Reached (${budgetConsumedPct}%)`;
    statusTagline = isHin 
      ? `आपने ₹${totalSpent.toLocaleString()} खर्च कर लिए हैं। ₹${remaining.toLocaleString()} शेष हैं।` 
      : `You've used ${budgetConsumedPct}% of your budget. ₹${remaining.toLocaleString()} remaining.`;
    guruAdvice = isHin 
      ? 'गुरु: संभलकर! सुरक्षित सीमा ₹' + safeDailyAllowance.toLocaleString() + '/दिन है।' 
      : `Guru: Caution ahead! Cap spending to ₹${safeDailyAllowance.toLocaleString()}/day.`;
    chatPrompt = `Guru, I reached 80% of my monthly budget. How can I manage the remaining ₹${remaining.toLocaleString()} across ${daysRemaining} days? Answer in Hinglish.`;
  } else if (paceDifference < -8) {
    statusBadge = isHin ? '✓ शानदार बचत गति' : '✓ AHEAD OF SCHEDULE';
    statusTitle = isHin ? `बजट सुरक्षित (${budgetConsumedPct}%)` : `Ahead of Schedule (${budgetConsumedPct}%)`;
    statusTagline = isHin 
      ? `माह का ${timeElapsedPct}% समय बीतने पर केवल ${budgetConsumedPct}% बजट खर्च हुआ।` 
      : `Only ${budgetConsumedPct}% spent while ${timeElapsedPct}% of the month has elapsed.`;
    guruAdvice = isHin 
      ? 'गुरु: बढ़िया जा रहे हो! आप ₹' + safeDailyAllowance.toLocaleString() + '/दिन आराम से खर्च कर सकते हैं।' 
      : `Guru: Stellar discipline! You have a comfortable buffer of ₹${safeDailyAllowance.toLocaleString()}/day.`;
    chatPrompt = 'Guru, my budget is ahead of schedule. Give me a smart tip to invest or save the surplus this month!';
  } else {
    statusBadge = isHin ? '✓ बजट संतुलन में' : '✓ BUDGET ON TRACK';
    statusTitle = isHin ? `बजट नियंत्रण में (${budgetConsumedPct}%)` : `Budget On Track (${budgetConsumedPct}%)`;
    statusTagline = isHin 
      ? `खर्च (${budgetConsumedPct}%) और समय (${timeElapsedPct}%) संतुलित हैं।` 
      : `Spending (${budgetConsumedPct}%) matches the calendar timeline (${timeElapsedPct}%).`;
    guruAdvice = isHin 
      ? 'गुरु: सही रफ्तार है। शेष ' + daysRemaining + ' दिनों के लिए ₹' + safeDailyAllowance.toLocaleString() + '/दिन रखें।' 
      : `Guru: On track! Maintain ₹${safeDailyAllowance.toLocaleString()}/day over the next ${daysRemaining} days.`;
    chatPrompt = 'Guru, my budget pacing is on track. How can I optimize my remaining expenses for this month?';
  }

  // Unified visual styling theme
  const theme = isExceeded
    ? {
        border: 'border-red-500/30',
        bg: 'bg-gradient-to-br from-[#221111] via-[#1a0f0f] to-[#121110]',
        glow: 'shadow-[0_0_30px_rgba(239,68,68,0.18)]',
        badge: 'bg-red-500/15 text-red-400 border border-red-500/30',
        accentText: 'text-red-400',
        progressFill: 'bg-red-500',
        Icon: Flame,
      }
    : isCritical
    ? {
        border: 'border-orange-500/30',
        bg: 'bg-gradient-to-br from-[#24160e] via-[#1a120e] to-[#121110]',
        glow: 'shadow-[0_0_30px_rgba(249,115,22,0.18)]',
        badge: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
        accentText: 'text-orange-400',
        progressFill: 'bg-orange-500',
        Icon: AlertOctagon,
      }
    : isWarning
    ? {
        border: 'border-[#D0BB95]/30',
        bg: 'bg-gradient-to-br from-[#201a10] via-[#17140e] to-[#121110]',
        glow: 'shadow-[0_0_30px_rgba(208,187,149,0.15)]',
        badge: 'bg-[#D0BB95]/15 text-[#D0BB95] border border-[#D0BB95]/30',
        accentText: 'text-[#D0BB95]',
        progressFill: 'bg-[#D0BB95]',
        Icon: AlertTriangle,
      }
    : paceDifference < -8
    ? {
        border: 'border-emerald-500/30',
        bg: 'bg-gradient-to-br from-[#0e1d17] via-[#101714] to-[#121110]',
        glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
        badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        accentText: 'text-emerald-400',
        progressFill: 'bg-emerald-500',
        Icon: TrendingDown,
      }
    : {
        border: 'border-white/5',
        bg: 'bg-[#121110]',
        glow: 'shadow-xl',
        badge: 'bg-primary/10 text-primary border border-primary/20',
        accentText: 'text-primary',
        progressFill: 'bg-primary',
        Icon: CheckCircle2,
      };

  const { Icon } = theme;

  if (allowance <= 0) {
    return (
      <section className="bg-[#121110] rounded-[2.5rem] p-6 border border-white/5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-sm font-black uppercase">
              {isHin ? 'मासिक बजट सेट करें' : 'Set Monthly Allowance'}
            </h4>
            <p className="text-slate-400 text-xs mt-0.5">
              {isHin ? 'दिन-दर-दिन खर्च गति को ट्रैक करने के लिए बजट निर्धारित करें।' : 'Set an allowance to compare spending pacing and monitor 80%/90% limits.'}
            </p>
          </div>
        </div>
        {onNavigateToTools && (
          <button 
            onClick={onNavigateToTools}
            className="px-4 py-2.5 rounded-xl bg-primary text-background-dark text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
          >
            {isHin ? 'बजट सेट करें' : 'Configure'}
          </button>
        )}
      </section>
    );
  }

  return (
    <section className={`rounded-[2.5rem] p-6 sm:p-7 border ${theme.border} ${theme.bg} ${theme.glow} transition-all duration-300 relative overflow-hidden space-y-5 shadow-2xl`}>
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className={`size-12 rounded-2xl ${theme.badge} flex items-center justify-center shrink-0 shadow-lg`}>
            <Icon className={`w-6 h-6 ${theme.accentText} ${isThresholdAlert ? 'animate-pulse' : ''}`} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full ${theme.badge}`}>
                {statusBadge}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">
                {monthName} {currentYear}
              </span>
            </div>
            <h3 className="text-white text-lg sm:text-xl font-black tracking-tight uppercase">
              {statusTitle}
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
              <span className="hidden sm:inline">{isHin ? 'परीक्षण' : 'Test'}</span>
            </button>
          )}

          {/* Days Left Chip */}
          <div className="text-right pl-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl bg-white/5 text-slate-300 border border-white/5 inline-block">
              {daysRemaining} {isHin ? 'दिन शेष' : 'Days Left'}
            </span>
          </div>
        </div>
      </div>

      {/* Threshold Simulator Controls (when toggled) */}
      {showSimModal && onSimulateThreshold && (
        <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 relative z-20 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              {isHin ? 'बजट स्तर का परीक्षण करें:' : 'Simulate Budget Threshold:'}
            </span>
            <button 
              onClick={() => setShowSimModal(false)}
              className="text-slate-500 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '50% Normal', pct: 50, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
              { label: '80% Alert', pct: 82, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
              { label: '90% Critical', pct: 92, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
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

      {/* Unified Progress Visualizer */}
      <div className="bg-[#181613] p-4 sm:p-5 rounded-3xl border border-white/5 space-y-3.5 relative z-10">
        {/* Track 1: Allowance Consumed with 80% & 90% Milestone Notches */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-slate-300">
              <Wallet className="w-3.5 h-3.5 text-primary" />
              <span>{isHin ? 'मासिक भत्ता खर्च' : 'Allowance Consumed'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">
                ₹{totalSpent.toLocaleString()} / ₹{allowance.toLocaleString()}
              </span>
              <span className={`font-black text-sm ${theme.accentText}`}>
                {budgetConsumedPct}%
              </span>
            </div>
          </div>

          <div className="relative h-3.5 w-full bg-[#100f0d] rounded-full overflow-hidden p-0.5 border border-white/5">
            {/* 80% and 90% threshold notch markers */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/80 z-20" 
              style={{ left: '80%' }}
              title="80% Warning Threshold"
            />
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-orange-500/90 z-20" 
              style={{ left: '90%' }}
              title="90% Critical Threshold"
            />

            <div 
              className={`h-full rounded-full transition-all duration-700 ${theme.progressFill}`}
              style={{ width: `${Math.min(100, budgetConsumedPct)}%` }}
            />
          </div>

          {/* Scale labels under allowance bar */}
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-black uppercase tracking-widest px-0.5">
            <span>₹0</span>
            <span className="text-yellow-400/70">80% Alert</span>
            <span className="text-orange-400/70">90% Critical</span>
            <span>₹{allowance.toLocaleString()}</span>
          </div>
        </div>

        {/* Track 2: Days in Month Elapsed (Calendar Time) */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{isHin ? 'माह का बीता समय' : 'Month Timeline'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">
                Day {daysPassed} of {totalDaysInMonth} ({timeElapsedPct}%)
              </span>
            </div>
          </div>

          <div className="relative h-2 w-full bg-[#100f0d] rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-slate-600 to-slate-400 transition-all duration-700"
              style={{ width: `${Math.min(100, timeElapsedPct)}%` }}
            />
          </div>
        </div>

        {/* Dynamic Pacing Tagline */}
        <p className="text-xs text-slate-300 font-medium pt-1">
          {statusTagline}
        </p>
      </div>

      {/* Clean 3-Card Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 relative z-10">
        <div className="bg-[#181613] p-3 sm:p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest block mb-1">
            {isHin ? 'कुल खर्च' : 'Total Spent'}
          </span>
          <p className="text-white text-sm sm:text-base font-black">
            ₹{totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#181613] p-3 sm:p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest block mb-1">
            {isHin ? 'शेष भत्ता' : 'Remaining'}
          </span>
          <p className={`text-sm sm:text-base font-black ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
            ₹{remaining.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#181613] p-3 sm:p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest block mb-1">
            {isHin ? 'दैनिक सुरक्षित' : 'Safe Daily'}
          </span>
          <p className={`text-sm sm:text-base font-black ${dailyBurnRateSoFar > safeDailyAllowance && !isOverBudget ? 'text-orange-400' : 'text-primary'}`}>
            ₹{safeDailyAllowance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Guru Guidance & Single Call to Action */}
      <div className="bg-black/30 rounded-2xl p-4 border border-white/5 flex items-start gap-3 relative z-10">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-2 text-xs flex-1">
          <p className={`font-black italic text-xs ${theme.accentText}`}>
            {guruAdvice}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => onAskGuru(chatPrompt)}
              className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-primary hover:underline"
            >
              <span>{isHin ? 'गुरु से रणनीति पूछें' : 'Ask Guru Strategy'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onNavigateToTools && (
              <button
                onClick={onNavigateToTools}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-300 transition-colors ml-auto"
              >
                {isHin ? 'भत्ता बदलें' : 'Adjust Budget'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetOverviewWidget;
