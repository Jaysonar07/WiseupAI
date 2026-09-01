
import React, { useState, useEffect } from 'react';
import { AppState, Transaction } from '../types';
import { analyzeReceipt } from '../services/geminiService';

interface ScanProps {
  state: AppState;
  scannedImage: string | null;
  onBack: () => void;
  onAddTransaction: (tx: Transaction) => void;
}

const ScanResultScreen: React.FC<ScanProps> = ({ state, scannedImage, onBack, onAddTransaction }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const processReceipt = async () => {
      if (!scannedImage) return;
      try {
        const analysis = await analyzeReceipt(scannedImage, { 
          goals: state.goals, 
          monthlyAllowance: state.monthlyAllowance 
        });
        setResult(analysis);
      } catch (err) {
        console.error("AI Analysis failed:", err);
        setResult({
          merchant: "Merchant Detected",
          amount: 450,
          date: new Date().toISOString(),
          category: "Food & Drinks",
          type: "Impulsive",
          insight: "Arre yaar, analysis fail ho gaya but Guru knows this looks like an impulse buy! Try to resist the urge next time."
        });
      } finally {
        setLoading(false);
      }
    };
    processReceipt();
  }, [scannedImage]);

  const handleConfirm = () => {
    if (!result) return;
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      merchant: result.merchant,
      amount: result.amount,
      category: result.category,
      type: result.type,
      date: new Date().toISOString(), // Use fresh current ISO timestamp
      icon: result.category.toLowerCase().includes('food') ? 'restaurant' : 'shopping_bag',
      imageUrl: scannedImage || undefined,
      source: 'scan',
      entryMethod: 'scanned_bill'
    };
    onAddTransaction(newTx);
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col bg-background-dark overflow-y-auto no-scrollbar pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-5 bg-background-dark/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={onBack} className="text-white flex size-10 items-center justify-center rounded-full bg-white/5 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-white text-base font-black uppercase tracking-widest">AI Bill Scanner</h2>
        <div className="w-10"></div>
      </div>

      <div className="h-[76px]"></div>

      <main className="flex-1 flex flex-col p-5 gap-8">
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl group border border-white/10">
          <img 
            src={scannedImage || "https://picsum.photos/seed/receipt/800/1000"} 
            className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'scale-110 blur-sm brightness-50' : 'scale-100'}`} 
            alt="Receipt" 
          />
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5">
              <div className="relative size-20">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary text-3xl animate-pulse">psychology</span>
                </div>
              </div>
              <p className="text-white text-xs font-black uppercase tracking-[0.3em] animate-pulse">Analyzing Spends...</p>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/40 shadow-[0_0_15px_rgba(208,187,149,0.5)] animate-[scan_2s_infinite]"></div>
            </div>
          )}
        </div>

        {!loading && result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="glass rounded-3xl p-6 border-l-4 border-l-primary space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Extracted Merchant</p>
                  <h3 className="text-2xl font-black text-white tracking-tight">{result.merchant}</h3>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Bill</p>
                  <h3 className="text-3xl font-black text-primary tracking-tighter">₹{result.amount.toLocaleString()}</h3>
                </div>
              </div>
              <div className="h-px bg-white/5"></div>
              <div className="flex justify-between items-center">
                 <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   result.type === 'Wise' ? 'bg-wise/10 text-wise' : 
                   result.type === 'Considerable' ? 'bg-primary/10 text-primary' : 
                   'bg-impulsive/10 text-impulsive'
                 }`}>
                   {result.type} Tag
                 </span>
                 <p className="text-slate-500 text-xs font-bold">{result.category}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                <h4 className="text-white text-sm font-black uppercase tracking-widest">Guru's Roast</h4>
              </div>
              <div className="glass rounded-3xl p-6 bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 relative">
                <div className="absolute -top-3 -right-3 size-12 bg-background-dark rounded-full flex items-center justify-center border border-primary/20">
                   <span className="material-symbols-outlined text-primary text-xl">forum</span>
                </div>
                <p className="text-slate-200 text-lg font-medium leading-relaxed italic">
                  "{result.insight}"
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {!loading && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-background-dark/80 backdrop-blur-xl border-t border-white/5 z-50 pb-10">
          <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
            <button onClick={onBack} className="h-14 rounded-2xl border border-white/10 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-white/5">
              Discard
            </button>
            <button 
              onClick={handleConfirm}
              className="h-14 rounded-2xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-transform"
            >
              Add Expense
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ScanResultScreen;
