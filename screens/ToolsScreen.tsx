
import React, { useState } from 'react';
import { AppState, Goal } from '../types';

interface ToolsProps {
  state: AppState;
  onBack: () => void;
  onAddGoal: (goal) => void;
}

const ToolsScreen: React.FC<ToolsProps> = ({ state, onBack, onAddGoal }) => {
  const [view, setView] = useState<'goal' | 'sip'>('goal');
  
  const t = {
    ENG: {
      header: 'SMART TOOLS',
      goalTab: 'GOAL SETTER',
      sipTab: 'SIP CALCULATOR',
      goalLabel: 'I WANT TO BUY',
      amountLabel: 'TARGET AMOUNT (₹)',
      timelineLabel: 'TARGET TIMELINE',
      months: 'Months',
      years: 'Years',
      saveToReach: 'To reach your goal, save',
      guruApproved: 'GURU APPROVED PLAN',
      startGoal: 'Start Saving Goal',
      futureValue: 'FUTURE VALUE',
      gains: 'GAINS',
      invested: 'INVESTED',
      monthlySip: 'MONTHLY SIP',
      returns: 'EXPECT RETURNS (%)',
      period: 'TIME PERIOD'
    },
    HIN: {
      header: 'स्मार्ट टूल्स',
      goalTab: 'लक्ष्य निर्धारण',
      sipTab: 'SIP कैलकुलेटर',
      goalLabel: 'मैं खरीदना चाहता हूँ',
      amountLabel: 'लक्ष्य राशि (₹)',
      timelineLabel: 'लक्ष्य समयरेखा',
      months: 'महीने',
      years: 'वर्ष',
      saveToReach: 'अपने लक्ष्य तक पहुँचने के लिए सहेजें',
      guruApproved: 'GURU APPROVED PLAN',
      startGoal: 'लक्ष्य बचत शुरू करें',
      futureValue: 'भविष्य का मूल्य',
      gains: 'मुनाफ़ा',
      invested: 'निवेश किया',
      monthlySip: 'मासिक SIP',
      returns: 'अपेक्षित रिटर्न (%)',
      period: 'समय अवधि'
    }
  }[state.language];

  // SIP State
  const [sipMonthly, setSipMonthly] = useState(0);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(5);

  // Goal State
  const [goalName, setGoalName] = useState('');
  const [goalMonths, setGoalMonths] = useState(1);
  const [goalAmount, setGoalAmount] = useState(0);

  const calculateSIP = () => {
    if (sipMonthly === 0) return { total: 0, invested: 0, gains: 0 };
    const i = sipRate / 100 / 12;
    const n = sipYears * 12;
    const total = sipMonthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = sipMonthly * n;
    const gains = total - invested;
    return { total: Math.round(total), invested: Math.round(invested), gains: Math.round(gains) };
  };

  const calculateGoalMonthly = () => goalAmount > 0 ? Math.round(goalAmount / goalMonths) : 0;

  const handleStartGoal = () => {
    if (!goalName || goalAmount <= 0) return;
    
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      name: goalName,
      targetAmount: goalAmount,
      savedAmount: 0,
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + goalMonths)).toISOString(),
      icon: 'shopping_bag'
    };
    
    onAddGoal(newGoal);
  };

  const sipData = calculateSIP();

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] overflow-y-auto no-scrollbar pb-32 transition-colors">
      <header className="sticky top-0 z-50 p-6 md:p-8 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/5">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.1em] text-white">{t.header}</h2>
        <button 
          onClick={onBack} 
          className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
        >
           <span className="material-symbols-outlined text-white/70">close</span>
        </button>
      </header>

      <div className="px-5 md:px-8 py-6 max-w-xl mx-auto w-full">
        <div className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#141210] p-1 border border-white/5 shadow-inner">
          <button 
            onClick={() => setView('goal')}
            className={`flex-1 h-full rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer ${view === 'goal' ? 'bg-[#D0BB95] text-[#141210] shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            {t.goalTab}
          </button>
          <button 
            onClick={() => setView('sip')}
            className={`flex-1 h-full rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer ${view === 'sip' ? 'bg-[#D0BB95] text-[#141210] shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            {t.sipTab}
          </button>
        </div>
      </div>

      <div className="px-5 md:px-8 max-w-5xl mx-auto w-full space-y-8">
        {view === 'goal' ? (
          <section className="animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-[#141210]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left Side: Inputs */}
                <div className="space-y-6">
                  <label className="block space-y-3">
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">{t.goalLabel}</p>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#D0BB95] text-2xl">shopping_bag</span>
                      </div>
                      <input 
                        type="text"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        className="w-full bg-[#0d0c0b] border border-white/5 text-white rounded-2xl h-14 md:h-16 pl-14 pr-6 text-base font-bold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="e.g., iPhone 16"
                      />
                    </div>
                  </label>

                  <label className="block space-y-3">
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">{t.amountLabel}</p>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={goalAmount || ''} 
                        onChange={(e) => setGoalAmount(Number(e.target.value))}
                        className="w-full bg-[#0d0c0b] border border-white/5 text-white rounded-2xl h-16 md:h-18 py-4 px-6 md:px-8 text-2xl md:text-3xl font-black focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all tracking-tight" 
                        placeholder="0"
                      />
                    </div>
                  </label>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.timelineLabel}</span>
                      <span className="text-base md:text-lg font-black text-primary">{goalMonths} {t.months}</span>
                    </div>
                    <div className="relative h-1.5 w-full bg-[#0d0c0b] rounded-full">
                      <input 
                        type="range" min="1" max="36" step="1" value={goalMonths} 
                        onChange={(e) => setGoalMonths(Number(e.target.value))}
                        className="absolute inset-0 w-full h-1.5 bg-transparent rounded-lg appearance-none cursor-pointer accent-primary z-10" 
                      />
                      <div className="absolute top-0 left-0 h-full bg-primary/40 rounded-full" style={{ width: `${(goalMonths / 36) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Output & Action */}
                <div className="space-y-6">
                  <div className="rounded-[2.5rem] bg-[#24211d] p-8 border border-white/5 text-center space-y-3 shadow-xl">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60">{t.saveToReach}</p>
                    <div className="flex items-center justify-center gap-1">
                      <h3 className="text-4xl md:text-5xl font-black text-primary tracking-tighter">₹{calculateGoalMonthly().toLocaleString()}</h3>
                      <span className="text-lg font-bold text-slate-500">/mo</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-2">
                       <span className="material-symbols-outlined text-wise text-sm filled">verified_user</span>
                       <p className="text-wise text-[10px] font-black uppercase tracking-[0.2em]">{t.guruApproved}</p>
                    </div>
                  </div>

                  <button 
                    onClick={handleStartGoal}
                    disabled={!goalName || goalAmount <= 0}
                    className="w-full h-14 md:h-16 bg-[#D0BB95] text-[#14120f] font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/10 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {t.startGoal}
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-[#141210]/80 border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Circular Gauge and Legend Section */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 bg-[#191714] p-6 md:p-8 rounded-3xl border border-white/5">
                  <div className="relative size-36 md:size-44 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-white/5" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#D0BB95" strokeWidth="3" strokeDasharray={`${sipData.total > 0 ? (sipData.gains / sipData.total) * 100 : 0} 100`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{t.futureValue}</span>
                      <span className="text-xl md:text-2xl font-black text-white">₹{(sipData.total / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <div className="space-y-5 text-center sm:text-left">
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <div className="size-2 rounded-full bg-[#D0BB95]"></div>
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.gains}</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-[#D0BB95] tracking-tight">₹{sipData.gains.toLocaleString()}</p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <div className="size-2 rounded-full bg-slate-700"></div>
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.invested}</span>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-white tracking-tight">₹{sipData.invested.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Input Rows Section */}
                <div className="space-y-6">
                  <div className="space-y-3">
                     <div className="flex justify-between items-center group">
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.1em]">{t.monthlySip}</span>
                        <span className="text-lg md:text-xl font-black text-white">₹{sipMonthly.toLocaleString()}</span>
                      </div>
                      <input type="range" min="0" max="50000" step="500" value={sipMonthly} onChange={(e) => setSipMonthly(Number(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#D0BB95]" />
                  </div>
                  
                  <div className="space-y-3">
                     <div className="flex justify-between items-center group">
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.1em]">{t.returns}</span>
                        <span className="text-lg md:text-xl font-black text-white">{sipRate}%</span>
                      </div>
                      <input type="range" min="1" max="30" step="1" value={sipRate} onChange={(e) => setSipRate(Number(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#D0BB95]" />
                  </div>

                  <div className="space-y-3">
                     <div className="flex justify-between items-center group">
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.1em]">{t.period}</span>
                        <span className="text-lg md:text-xl font-black text-white">{sipYears} {t.years}</span>
                      </div>
                      <input type="range" min="1" max="30" step="1" value={sipYears} onChange={(e) => setSipYears(Number(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#D0BB95]" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ToolsScreen;
