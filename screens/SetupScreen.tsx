
import React, { useState } from 'react';
import { AppState } from '../types';

interface SetupScreenProps {
  state: AppState;
  onSave: (amount: number) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ state, onSave }) => {
  const [value, setValue] = useState<string>('');
  const quickOptions = [5000, 10000, 15000, 20000];

  const t = {
    ENG: {
      title: 'Set Monthly Allowance',
      advice: '"Setting your allowance helps me give you better advice!"',
      placeholder: '0',
      quick: 'Quick Select',
      save: 'Save Allowance',
      footer: 'Secured by WiseupAI Financial Engine'
    },
    HIN: {
      title: 'मासिक भत्ता निर्धारित करें',
      advice: '"अपना भत्ता निर्धारित करने से मुझे आपको बेहतर सलाह देने में मदद मिलती है!"',
      placeholder: '0',
      quick: 'त्वरित चयन',
      save: 'भत्ता सहेजें',
      footer: 'WiseupAI वित्तीय इंजन द्वारा सुरक्षित'
    }
  }[state.language];

  return (
    <div className="flex-1 flex flex-col p-6 relative bg-background-light dark:bg-background-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
      
      <header className="flex items-center justify-between pt-6 mb-8 relative z-10">
        <button className="flex size-10 items-center justify-center rounded-full text-slate-800 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        <h1 className="text-slate-900 dark:text-white text-2xl font-bold text-center mt-2 mb-8">{t.title}</h1>
        
        <div className="flex flex-col items-center justify-center gap-3 mb-10">
          <div className="relative">
            <div className="size-16 rounded-2xl overflow-hidden border border-primary/30 shadow-[0_0_25px_rgba(208,187,149,0.3)]">
              <img src="/logo.png" alt="WiseupAI Logo" className="size-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-background-light dark:border-background-dark"></div>
          </div>
          <div className="text-center space-y-1 max-w-[90%]">
            <p className="text-primary text-sm font-medium">
              {t.advice}
            </p>
          </div>
        </div>

        <div className="w-full mb-8 group">
          <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-primary/20 rounded-3xl h-24 flex items-center justify-center px-6 transition-all group-focus-within:border-primary/50">
            <span className="text-primary text-4xl font-bold mr-2 mt-1">₹</span>
            <input 
              className="bg-transparent border-none text-slate-900 dark:text-white text-5xl font-bold w-full text-center focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-white/10"
              placeholder={t.placeholder}
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <p className="text-slate-500 dark:text-white/40 text-xs font-bold uppercase tracking-wider text-center">{t.quick}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {quickOptions.map(opt => (
              <button 
                key={opt}
                onClick={() => setValue(opt.toString())}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 h-10 px-5 rounded-full text-slate-700 dark:text-white/90 text-sm font-medium hover:bg-primary hover:text-background-dark transition-all active:scale-95 shadow-sm"
              >
                ₹{opt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1"></div>

        <div className="pb-8">
          <button 
            onClick={() => onSave(Number(value) || 0)}
            className="group relative w-full h-14 bg-primary rounded-xl flex items-center justify-center overflow-hidden transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            <span className="relative text-background-dark text-lg font-bold tracking-wide">{t.save}</span>
            <span className="relative material-symbols-outlined ml-2 text-background-dark">check_circle</span>
          </button>
          <p className="text-center text-slate-400 dark:text-white/20 text-[10px] mt-4 font-medium uppercase tracking-widest">
            {t.footer}
          </p>
        </div>
      </main>
    </div>
  );
};

export default SetupScreen;
