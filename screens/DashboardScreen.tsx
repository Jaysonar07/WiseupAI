
import React, { useState, useMemo } from 'react';
import { AppState, Goal } from '../types';
import BudgetOverviewWidget from '../components/BudgetOverviewWidget';
import { calculateBudgetStatus } from '../utils/budgetMonitor';

interface DashboardProps {
  state: AppState;
  onAction: (screen: AppState['currentScreen'], query?: string) => void;
  onUpdateGoal: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
  onSimulateThreshold?: (percentage: number) => void;
  onResetSampleData?: () => void;
}

const DashboardScreen: React.FC<DashboardProps> = ({ 
  state, 
  onAction, 
  onUpdateGoal, 
  onDeleteGoal,
  onSimulateThreshold,
  onResetSampleData
}) => {
  const [goalSaveInputs, setGoalSaveInputs] = useState<{ [key: string]: string }>({});
  const [sampleLoaded, setSampleLoaded] = useState(false);

  // Compute live budget status against monthly allowance
  const budgetInfo = useMemo(() => {
    return calculateBudgetStatus(state.transactions, state.monthlyAllowance, state.language);
  }, [state.transactions, state.monthlyAllowance, state.language]);

  const totalSpent = state.transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const impulsiveSpent = state.transactions
    .filter(t => t.type === 'Impulsive')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const considerableSpent = state.transactions
    .filter(t => t.type === 'Considerable')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const wiseSpent = state.transactions
    .filter(t => t.type === 'Wise')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const t = {
    ENG: {
      welcome: `${state.user.name} 👋`,
      morning: 'HI THERE',
      goals: 'YOUR GOALS',
      activeGoals: 'ACTIVE SAVING GOALS',
      wise: 'WISE',
      considerable: 'CONSIDERABLE',
      impulsive: 'IMPULSIVE',
      roast: 'ROAST MY SPENDING',
      praise: 'GURU PRAISE',
      starter: 'STARTER ADVICE',
      planMore: 'PLAN MORE',
      smartMoves: 'SMART NEEDS',
      plannedMoves: 'PLANNED MOVES',
      guruWatching: 'GURU IS WATCHING',
      addSaving: 'Add Saving',
      completed: 'Goal Completed!',
      roastPrompt: "Bhai, roast my recent spending habits properly! Be brutal and witty based on my transactions. Use Hinglish and keep it to 4-6 lines.",
      praisePrompt: "Guru, look at my discipline! I have zero impulsive spends. Give me a 'Shabaashi' (praise) in your witty Hinglish style. Tell me why discipline is the key to wealth.",
      starterPrompt: "Guru, I have no transactions yet. What's your advice for a fresh starter? Be encouraging but keep it witty in Hinglish!",
      roastSubtitle: 'LET THE GURU JUDGE YOUR WALLET',
      praiseSubtitle: 'GURU IS IMPRESSED WITH YOU',
      starterSubtitle: 'GET STARTED ON YOUR JOURNEY'
    },
    HIN: {
      welcome: `${state.user.name} 👋`,
      morning: 'स्वागत है',
      goals: 'आपके लक्ष्य',
      activeGoals: 'सक्रिय बचत लक्ष्य',
      wise: 'समझदारी',
      considerable: 'महत्वपूर्ण',
      impulsive: 'लापरवाह',
      roast: 'मेरा खर्च रोस्ट करो',
      praise: 'गुरु की शाबाशी',
      starter: 'शुरुआती सलाह',
      planMore: 'और योजना बनाएं',
      smartMoves: 'बुद्धिमत्ता',
      plannedMoves: 'योजनाबद्ध',
      guruWatching: 'गुरु देख रहा है',
      addSaving: 'बचत जोड़ें',
      completed: 'लक्षय पूरा हुआ!',
      roastPrompt: "मेरे हालिया खर्चों को रोस्ट करें। हिंग्लिश में और मजाकिया अंदाज में 4-6 लाइनों में जवाब दें।",
      praisePrompt: "गुरु, मेरा अनुशासन देखो! मेरा एक भी लापरवाह खर्च नहीं है। मुझे अपनी शैली में शाबाशी दें।",
      starterPrompt: "गुरु, अभी तक मेरा कोई खर्च नहीं है। एक नए खिलाड़ी के लिए आपकी क्या सलाह है?",
      roastSubtitle: 'गुरु को अपने बटुए का न्याय करने दें',
      praiseSubtitle: 'गुरु आपसे प्रभावित हैं',
      starterSubtitle: 'अपनी यात्रा शुरू करें'
    }
  }[state.language];

  const handleGoalSave = (goalId: string) => {
    const amount = Number(goalSaveInputs[goalId]);
    if (isNaN(amount) || amount <= 0) return;
    onUpdateGoal(goalId, amount);
    setGoalSaveInputs(prev => ({ ...prev, [goalId]: '' }));
  };

  const roastStatus = totalSpent === 0 ? 'starter' : (impulsiveSpent === 0 ? 'praise' : 'roast');
  const roastLabel = roastStatus === 'starter' ? t.starter : (roastStatus === 'praise' ? t.praise : t.roast);
  const roastSubtitle = roastStatus === 'starter' ? t.starterSubtitle : (roastStatus === 'praise' ? t.praiseSubtitle : t.roastSubtitle);
  const roastIcon = roastStatus === 'starter' ? 'emoji_objects' : (roastStatus === 'praise' ? 'verified_user' : 'local_fire_department');
  const roastColor = roastStatus === 'starter' ? 'text-primary' : (roastStatus === 'praise' ? 'text-wise' : 'text-red-500');
  const roastBg = roastStatus === 'starter' ? 'bg-primary/10' : (roastStatus === 'praise' ? 'bg-wise/10' : 'bg-red-500/10');
  const roastBorder = roastStatus === 'starter' ? 'border-primary/20' : (roastStatus === 'praise' ? 'border-wise/20' : 'border-red-500/20');

  const triggerRoastAction = () => {
    const prompt = roastStatus === 'starter' ? t.starterPrompt : (roastStatus === 'praise' ? t.praisePrompt : t.roastPrompt);
    onAction('chat', prompt);
  };

  return (
    <div className="flex-1 flex flex-col p-5 md:p-8 pb-32 md:pb-12 overflow-y-auto no-scrollbar relative bg-[#050505] transition-colors">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

      <header className="relative z-10 flex items-center justify-between pt-2 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => onAction('settings')}>
            <div className="size-12 md:size-14 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/10 ring-2 ring-white/5">
              {state.user.avatar ? (
                <img src={state.user.avatar} className="size-full object-cover" alt="Profile" />
              ) : (
                <span className="material-symbols-outlined text-slate-400">person</span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-[#050505]"></div>
          </div>
          <div>
            <p className="text-primary/50 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">{t.morning}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-white text-xl md:text-2xl font-black tracking-tight">{t.welcome}</h1>
              {onResetSampleData && (
                <button
                  onClick={() => {
                    onResetSampleData();
                    setSampleLoaded(true);
                    setTimeout(() => setSampleLoaded(false), 2500);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    sampleLoaded
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 active:scale-95'
                  }`}
                  title={state.language === 'HIN' ? 'नमूना डेटा लोड करें' : 'Load sample analysis data'}
                >
                  <span className="material-symbols-outlined text-sm">
                    {sampleLoaded ? 'check_circle' : 'dataset'}
                  </span>
                  <span>
                    {sampleLoaded 
                      ? (state.language === 'HIN' ? 'डेटा लोड हुआ' : 'Loaded!') 
                      : (state.language === 'HIN' ? 'नमूना डेटा' : 'Sample Data')}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onAction('tools')}
            className="hidden sm:flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
          >
            <span className="material-symbols-outlined text-base">calculate</span>
            <span>{t.planMore}</span>
          </button>
          <button 
            onClick={() => onAction('settings')} 
            className="flex items-center justify-center rounded-full size-11 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400 text-2xl">tune</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 space-y-8">
        {/* Responsive 2-Column Grid on Tablet/Desktop (lg:) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Primary Actions, Roast & Budget Widget) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Roast CTA Card */}
            <section>
              <button 
                onClick={triggerRoastAction}
                className="w-full bg-[#121110] rounded-[2.5rem] p-6 md:p-7 border border-white/5 group hover:border-white/20 transition-all active:scale-[0.98] shadow-2xl relative overflow-hidden text-left cursor-pointer"
              >
                <div className={`absolute -right-20 -top-20 size-64 blur-[100px] pointer-events-none opacity-10 ${roastStatus === 'praise' ? 'bg-wise' : (roastStatus === 'starter' ? 'bg-primary' : 'bg-red-500')}`}></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-5">
                    <div className={`size-14 rounded-2xl ${roastBg} flex items-center justify-center border ${roastBorder} group-hover:scale-105 transition-transform`}>
                      <span className={`material-symbols-outlined ${roastColor} text-3xl filled`}>{roastIcon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-black text-base uppercase tracking-tight mb-0.5">
                        {roastLabel}
                      </h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{roastSubtitle}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              </button>
            </section>

            {/* Unified Budget & Pacing Overview */}
            <BudgetOverviewWidget
              transactions={state.transactions}
              monthlyAllowance={state.monthlyAllowance}
              language={state.language}
              onNavigateToTools={() => onAction('tools')}
              onAskGuru={(prompt) => onAction('chat', prompt)}
              onSimulateThreshold={onSimulateThreshold}
            />
          </div>

          {/* Right Column (Wise vs Impulsive Stats & Active Savings Goals) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Wise, Considerable & Impulsive 3-Card Row */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-[#121110] rounded-[2rem] p-5 border border-emerald-500/10 shadow-xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-2 rounded-full bg-wise shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">{t.wise}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-2">₹{wiseSpent.toLocaleString()}</p>
                <p className="text-[9px] text-wise font-black uppercase tracking-[0.15em]">{t.smartMoves}</p>
              </div>

              <div className="bg-[#121110] rounded-[2rem] p-5 border border-[#D0BB95]/15 shadow-xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-2 rounded-full bg-[#D0BB95] shadow-[0_0_8px_rgba(208,187,149,0.5)]"></div>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">{t.considerable}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#D0BB95] tracking-tighter mb-2">₹{considerableSpent.toLocaleString()}</p>
                <p className="text-[9px] text-[#D0BB95]/80 font-black uppercase tracking-[0.15em]">{t.plannedMoves}</p>
              </div>
              
              <div className="bg-[#121110] rounded-[2rem] p-5 border border-red-500/10 shadow-xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-2 rounded-full bg-impulsive shadow-[0_0_8px_rgba(255,82,82,0.5)]"></div>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">{t.impulsive}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-2">₹{impulsiveSpent.toLocaleString()}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] text-impulsive font-black uppercase tracking-[0.15em]">{t.guruWatching}</p>
                  <span className="text-xs">💸</span>
                </div>
              </div>
            </section>

            {/* Active Goals Card Section */}
            {state.goals.length > 0 && (
              <section className="bg-[#121110] rounded-[2.5rem] p-6 border border-white/5 shadow-xl space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-white text-xs font-black uppercase tracking-widest">{t.activeGoals}</h3>
                  <button 
                    onClick={() => onAction('tools')}
                    className="text-primary hover:underline text-[10px] font-black uppercase tracking-wider"
                  >
                    + Add Goal
                  </button>
                </div>
                <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
                  {state.goals.map(goal => {
                    const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                    const isCompleted = progress >= 100;
                    return (
                      <div key={goal.id} className="bg-[#191816] rounded-2xl p-4 border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                              <span className="material-symbols-outlined text-primary text-xl">{goal.icon}</span>
                            </div>
                            <div>
                              <h4 className="text-white text-sm font-black tracking-tight uppercase">{goal.name}</h4>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                ₹{goal.savedAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {!isCompleted && (
                              <>
                                <input 
                                  type="number"
                                  placeholder="₹"
                                  value={goalSaveInputs[goal.id] || ''}
                                  onChange={(e) => setGoalSaveInputs(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                  className="w-14 h-8 bg-[#0d0c0b] border border-white/5 rounded-lg text-xs text-white px-2 focus:ring-1 focus:ring-primary/40 outline-none"
                                />
                                <button 
                                  onClick={() => handleGoalSave(goal.id)}
                                  className="bg-primary text-background-dark text-[10px] font-black uppercase px-2.5 h-8 rounded-lg shadow-lg shadow-primary/10 active:scale-95 transition-all cursor-pointer"
                                >
                                  Save
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => onDeleteGoal(goal.id)}
                              className="size-8 rounded-lg bg-white/5 text-slate-500 flex items-center justify-center hover:bg-red-500 transition-all hover:text-white cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">delete</span>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                            <span className={isCompleted ? "text-wise" : "text-slate-400"}>
                              {isCompleted ? t.completed : `${Math.round(progress)}% Complete`}
                            </span>
                            <span className="text-slate-500">₹{(goal.targetAmount - goal.savedAmount > 0 ? goal.targetAmount - goal.savedAmount : 0).toLocaleString()} left</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-700 ${isCompleted ? 'bg-wise' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Quick Feature Shortcuts on Tablet/Laptop */}
            <section className="bg-gradient-to-br from-[#181613] to-[#11100f] rounded-[2.5rem] p-6 border border-white/5 shadow-xl space-y-4">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Explore Capabilities</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onAction('analytics')}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-all group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary text-2xl mb-2 block group-hover:scale-110 transition-transform">insights</span>
                  <h4 className="text-white text-xs font-black uppercase">Deep Stats</h4>
                  <p className="text-[10px] text-slate-500">Trends & Heatmaps</p>
                </button>
                <button
                  onClick={() => onAction('offers')}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-all group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-emerald-400 text-2xl mb-2 block group-hover:scale-110 transition-transform">local_offer</span>
                  <h4 className="text-white text-xs font-black uppercase">Perks</h4>
                  <p className="text-[10px] text-slate-500">Student Discounts</p>
                </button>
              </div>
            </section>
          </div>
        </div>

        <footer className="flex flex-col items-center justify-center gap-1 mt-12 mb-4 opacity-30">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            Created by the Perpetual Motion Squad
          </p>
        </footer>
      </main>
    </div>
  );
};

export default DashboardScreen;
