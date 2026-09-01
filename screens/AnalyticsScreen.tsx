
import React, { useState, useMemo } from 'react';
import { AppState, Transaction } from '../types';
import { Info, Sparkles, Coffee, GraduationCap, ShoppingBag, Smartphone, ChevronRight, LayoutGrid, Briefcase, Zap, Bus, Film, Palette, Keyboard } from 'lucide-react';
import { motion } from 'motion/react';
import MergedAnalyticsHub from '../components/MergedAnalyticsHub';

interface AnalyticsProps {
  state: AppState;
  onBack: () => void;
  onAction: (screen: AppState['currentScreen'], query?: string) => void;
}

const AnalyticsScreen: React.FC<AnalyticsProps> = ({ state, onBack, onAction }) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(2);
  
  const monthNames = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'long' }));
    }
    return months;
  }, []);

  const currentMonthDate = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (2 - selectedMonthIndex));
    return d;
  }, [selectedMonthIndex]);

  const filteredTransactions = useMemo(() => {
    const m = currentMonthDate.getMonth();
    const y = currentMonthDate.getFullYear();
    
    return state.transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === m && txDate.getFullYear() === y;
    });
  }, [state.transactions, currentMonthDate]);

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const impulsiveCount = filteredTransactions.filter(t => t.type === 'Impulsive').length;
    
    // Simple streak calculation: longest sequence of days in the current month with no impulsive transactions
    // In a real app this would be more complex
    const streak = 12; // Mocking from screenshot as demo

    return { total, impulsiveCount, streak };
  }, [filteredTransactions]);

  const heatmapData = useMemo(() => {
    const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay(); // 0 is Sunday
    
    // Adjust Sunday from 0 to 6 if we want Monday as first day (like image)
    const padding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days = [];
    
    // Pad initial days
    for (let i = 0; i < padding; i++) {
      days.push({ day: null, intensity: 0 });
    }
    
    // Fill days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayTxs = filteredTransactions.filter(tx => new Date(tx.date).getDate() === i);
      const total = dayTxs.reduce((acc, curr) => acc + curr.amount, 0);
      const hasImpulsive = dayTxs.some(tx => tx.type === 'Impulsive');
      
      let intensity = 0;
      if (total > 0) {
        if (hasImpulsive || total > 1000) intensity = 3; // High (Red)
        else if (total > 300) intensity = 2; // Mid (Teal)
        else intensity = 1; // Low (Teal-dark)
      }
      
      days.push({ day: i, intensity });
    }
    
    return days;
  }, [currentMonthDate, filteredTransactions]);

  const getIntensityClass = (level: number) => {
    switch (level) {
      case 3: return 'bg-[#ff5252] text-white'; // High
      case 2: return 'bg-[#10b981] text-black font-bold'; // Mid
      case 1: return 'bg-[#064e3b] text-[#10b981]'; // Low
      default: return 'bg-[#1a181b] text-slate-600'; // None
    }
  };

  const getIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('coffee') || c.includes('food') || c.includes('starbucks') || c.includes('mcdonald') || c.includes('burger') || c.includes('cream')) return <Coffee size={20} />;
    if (c.includes('movie') || c.includes('cinema') || c.includes('film') || c.includes('entertainment')) return <Film size={20} />;
    if (c.includes('transit') || c.includes('bus') || c.includes('metro') || c.includes('rikshow') || c.includes('rickshaw') || c.includes('auto')) return <Bus size={20} />;
    if (c.includes('edu') || c.includes('course') || c.includes('book') || c.includes('learning') || c.includes('station')) return <GraduationCap size={20} />;
    if (c.includes('keyboard') || c.includes('tech')) return <Keyboard size={20} />;
    if (c.includes('poster') || c.includes('decor') || c.includes('art')) return <Palette size={20} />;
    if (c.includes('grocery') || c.includes('shopping') || c.includes('shoe') || c.includes('cloth') || c.includes('apparel') || c.includes('mart')) return <ShoppingBag size={20} />;
    if (c.includes('game') || c.includes('app') || c.includes('phone')) return <Smartphone size={20} />;
    if (c.includes('work')) return <Briefcase size={20} />;
    if (c.includes('util')) return <Zap size={20} />;
    return <LayoutGrid size={20} />;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto no-scrollbar pb-32 font-display">
      <header className="p-6 md:p-8 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
            >
              ANALYSIS & PATTERNS
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-black text-white tracking-tight"
            >
              Spending Habits
            </motion.h2>
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {monthNames.map((m, i) => (
              <button 
                key={m} 
                onClick={() => setSelectedMonthIndex(i)}
                className={`h-10 md:h-11 px-5 md:px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer ${selectedMonthIndex === i ? 'bg-[#D0BB95] text-black shadow-lg shadow-[#D0BB95]/10' : 'bg-[#14120e] text-slate-500 border border-white/5 hover:text-white'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-5 md:px-8 space-y-6 mt-4">
        {/* Key Stats Row */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-[#141215] p-5 md:p-6 rounded-3xl border border-white/5 space-y-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Spent ({monthNames[selectedMonthIndex]})</p>
            <p className="text-xl md:text-2xl font-black text-white tracking-tighter">₹{stats.total.toLocaleString()}</p>
          </div>
          <div className="bg-[#1a1212] p-5 md:p-6 rounded-3xl border border-red-500/10 space-y-1">
            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Impulsive Transactions</p>
            <p className="text-xl md:text-2xl font-black text-red-500 tracking-tighter">{stats.impulsiveCount} Txns</p>
          </div>
          <div className="bg-[#121a15] p-5 md:p-6 rounded-3xl border border-green-500/10 space-y-1">
            <p className="text-[9px] font-black text-green-400 uppercase tracking-widest">Clean Streak</p>
            <p className="text-xl md:text-2xl font-black text-green-500 tracking-tighter">{stats.streak} Days</p>
          </div>
        </section>

        {/* Merged Single Element Hub: Expense Source + Spending Trends + Intensity Heatmap (Scroll / Swipe Horizontal) */}
        <MergedAnalyticsHub
          transactions={state.transactions}
          monthlyAllowance={state.monthlyAllowance}
          language={state.language}
          selectedMonthDate={currentMonthDate}
          selectedMonthName={monthNames[selectedMonthIndex]}
          onAction={onAction}
        />

        {/* Lower Row: AI Actionable Insight & Filtered Activity History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* AI Insight Card */}
          <div className="lg:col-span-5 space-y-4">
            <section className="bg-[#141215] rounded-[2.5rem] p-6 border border-white/5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-white text-base font-black tracking-tight uppercase">AI Spending Coach</h3>
                </div>
                <span className="text-[9px] font-black bg-primary/15 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Live Analysis
                </span>
              </div>

              <div className="bg-[#1b191d] rounded-2xl p-4 border border-white/5 space-y-2">
                <p className="text-slate-300 text-xs font-medium leading-relaxed">
                  You tend to log most impulsive snacks and treats on weekends. Setting a "No-Spend Sunday" challenge could save you up to ₹1,800 this month!
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-primary font-bold">
                  <Info size={13} />
                  <span>Tip: Scan receipts right away to catch hidden impulses.</span>
                </div>
              </div>

              <button 
                onClick={() => onAction('chat', `Analyze my spending patterns for ${monthNames[selectedMonthIndex]} and give me actionable insights.`)}
                className="w-full bg-[#D0BB95] text-[#141210] font-black text-xs uppercase tracking-widest rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Ask Guru For Personalized Plan</span>
              </button>
            </section>
          </div>

          {/* Filtered History */}
          <div className="lg:col-span-7 space-y-4">
            <section className="space-y-4 bg-[#141215] rounded-[2.5rem] p-6 border border-white/5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-base font-black tracking-tight uppercase">Activity for {monthNames[selectedMonthIndex]}</h3>
                  <p className="text-slate-500 text-[11px] font-medium">Classified transactions with source badges</p>
                </div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  {filteredTransactions.length} Items
                </span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto no-scrollbar">
                {filteredTransactions.slice(0, 8).map((tx) => (
                  <motion.div 
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#1a181b] p-3.5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-[#221f24] transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        {getIcon(tx.category || tx.merchant)}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-xs font-black tracking-tight">{tx.merchant}</p>
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider ${
                            tx.source === 'scan' || tx.imageUrl || tx.entryMethod === 'scanned_bill'
                              ? 'bg-[#D0BB95]/15 text-[#D0BB95]'
                              : 'bg-[#818cf8]/15 text-[#818cf8]'
                          }`}>
                            {tx.source === 'scan' || tx.imageUrl || tx.entryMethod === 'scanned_bill' ? 'Scan' : 'Manual'}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                          {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} • {new Date(tx.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-white font-black text-sm tracking-tight">₹{tx.amount.toLocaleString()}</p>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase ${
                        tx.type === 'Wise' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : tx.type === 'Considerable' 
                          ? 'bg-[#D0BB95]/15 text-[#D0BB95] border border-[#D0BB95]/30' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {tx.type}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="py-12 text-center space-y-1">
                    <p className="text-slate-400 font-bold text-xs">No transactions recorded for {monthNames[selectedMonthIndex]}</p>
                    <p className="text-slate-600 font-medium text-[11px]">Scan a bill or add a manual entry to get started.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsScreen;
