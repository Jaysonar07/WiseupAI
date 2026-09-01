
import React, { useState } from 'react';
import { AppState, Transaction } from '../types';
import { classifyManualExpense } from '../services/geminiService';

interface ManualEntryProps {
  state: AppState;
  onBack: () => void;
  onAddTransaction: (tx: Transaction) => void;
}

const ManualEntryScreen: React.FC<ManualEntryProps> = ({ state, onBack, onAddTransaction }) => {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const t = {
    ENG: {
      title: 'Manual Entry',
      merchantPlaceholder: 'Where did you spend?',
      amountPlaceholder: '0.00',
      analyze: 'Analyze Expense',
      confirm: 'Confirm & Add',
      discard: 'Discard',
      roastHeader: "Guru's Insight",
      waiting: 'Guru is thinking...'
    },
    HIN: {
      title: 'मैनुअल प्रविष्टि',
      merchantPlaceholder: 'आपने कहाँ खर्च किया?',
      amountPlaceholder: '0.00',
      analyze: 'खर्च का विश्लेषण करें',
      confirm: 'पुष्टि करें और जोड़ें',
      discard: 'रद्द करें',
      roastHeader: "गुरु की अंतर्दृष्टि",
      waiting: 'गुरु सोच रहा है...'
    }
  }[state.language];

  const handleAnalyze = async () => {
    if (!merchant || !amount || loading) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await classifyManualExpense(merchant, Number(amount), {
        goals: state.goals,
        monthlyAllowance: state.monthlyAllowance
      });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      // Fallback analysis using basic logic
      const amt = Number(amount);
      let type: 'Wise' | 'Considerable' | 'Impulsive' = 'Wise';
      if (amt > state.monthlyAllowance * 0.35) type = 'Impulsive';
      else if (amt > state.monthlyAllowance * 0.15) type = 'Considerable';

      setAnalysis({
        category: 'Misc',
        type: type,
        insight: `Bhai, analysis fail ho gaya but Guru is judging. Since you spent ₹${amt}, this is marked as ${type}. Budget ka dhyaan rakho!`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!analysis) return;
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      merchant,
      amount: Number(amount),
      category: analysis.category,
      type: analysis.type,
      date: new Date().toISOString(),
      icon: 'receipt_long',
      source: 'manual',
      entryMethod: 'manual_entry'
    };
    onAddTransaction(newTx);
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto no-scrollbar pb-32">
      <header className="sticky top-0 z-50 p-6 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/5">
        <h2 className="text-xl font-black uppercase tracking-[0.15em] text-white">{t.title}</h2>
        <button 
          onClick={onBack} 
          className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
        >
           <span className="material-symbols-outlined text-white/70">close</span>
        </button>
      </header>

      <main className="p-6 space-y-8">
        <div className="space-y-6">
          <label className="block space-y-3">
             <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">{state.language === 'ENG' ? 'MERCHANT' : 'व्यापारी'}</p>
             <input 
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder={t.merchantPlaceholder}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl h-14 px-5 text-base font-bold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
             />
          </label>

          <label className="block space-y-3">
             <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">{state.language === 'ENG' ? 'AMOUNT' : 'राशि'}</p>
             <div className="relative">
               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black text-2xl">₹</span>
               <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t.amountPlaceholder}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl h-18 py-5 pl-12 pr-5 text-3xl font-black focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
               />
             </div>
          </label>

          <button 
            onClick={handleAnalyze}
            disabled={!merchant || !amount || loading}
            className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${loading ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-primary text-background-dark shadow-xl shadow-primary/20 active:scale-95'}`}
          >
            {loading ? t.waiting : t.analyze}
          </button>
        </div>

        {analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-5 space-y-6">
            <div className="bg-[#1a1814] rounded-[2.5rem] p-6 border border-white/5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">AUTO CATEGORY</p>
                   <p className="text-white font-black text-lg">{analysis.category}</p>
                </div>
                <div className="text-right">
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">CLASSIFICATION</p>
                   <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                     analysis.type === 'Wise' ? 'bg-wise/20 text-wise' : 
                     analysis.type === 'Considerable' ? 'bg-primary/20 text-primary' : 
                     'bg-impulsive/20 text-impulsive'
                   }`}>
                      {analysis.type}
                   </span>
                </div>
              </div>
              
              <div className="h-px bg-white/5"></div>

              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary text-lg">psychology</span>
                   <p className="text-primary text-[10px] font-black uppercase tracking-widest">{t.roastHeader}</p>
                 </div>
                 <p className="text-slate-300 italic text-sm leading-relaxed font-medium">
                    "{analysis.insight}"
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setAnalysis(null)} className="h-14 rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest">
                  {t.discard}
               </button>
               <button onClick={handleConfirm} className="h-14 rounded-2xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
                  {t.confirm}
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManualEntryScreen;
