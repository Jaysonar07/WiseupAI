
import React, { useState, useRef } from 'react';
import { AppState } from '../types';
import { exportTransactionsToCSV } from '../utils/csvExport';

interface SettingsProps {
  state: AppState;
  onBack: () => void;
  onLogout: () => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onUpdateProfile: (name: string, avatar: string) => void;
  onUpdateAllowance?: (amount: number) => void;
  onOpenSetup?: () => void;
  onResetSampleData?: () => void;
}

// Preset Avatars for ultra-fast, premium customization
const PRESET_AVATARS = [
  { id: 'av0', url: '/default-avatar.png', label: 'Pizza (Default)' },
  { id: 'av1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80', label: 'Olivia' },
  { id: 'av2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', label: 'Ethan' },
  { id: 'av3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', label: 'Sophia' },
  { id: 'av4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', label: 'Liam' },
  { id: 'av5', url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=150&h=150&q=80', label: 'Jordan' },
  { id: 'av6', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80', label: 'Cosmic' }
];

const SettingsScreen: React.FC<SettingsProps> = ({ 
  state, 
  onBack, 
  onLogout, 
  onToggleLang, 
  onToggleTheme, 
  onUpdateProfile,
  onUpdateAllowance,
  onOpenSetup,
  onResetSampleData
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(state.user.name);
  const [editedAvatar, setEditedAvatar] = useState(state.user.avatar);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [sampleFeedback, setSampleFeedback] = useState<string | null>(null);
  const [isEditingAllowance, setIsEditingAllowance] = useState(false);
  const [editedAllowance, setEditedAllowance] = useState(state.monthlyAllowance > 0 ? state.monthlyAllowance.toString() : '');
  const [allowanceFeedback, setAllowanceFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (url: string) => {
    setEditedAvatar(url);
  };

  const handleSave = () => {
    if (!editedName.trim()) return;
    onUpdateProfile(editedName.trim(), editedAvatar);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedName(state.user.name);
    setEditedAvatar(state.user.avatar);
    setIsEditing(false);
  };

  const handleSaveAllowance = () => {
    const amount = Number(editedAllowance);
    if (isNaN(amount) || amount <= 0) return;
    onUpdateAllowance?.(amount);
    setIsEditingAllowance(false);
    setAllowanceFeedback(state.language === 'HIN'
      ? `मासिक भत्ता ₹${amount.toLocaleString()} अपडेट हो गया`
      : `Monthly allowance updated to ₹${amount.toLocaleString()}`);
    setTimeout(() => setAllowanceFeedback(null), 4000);
  };

  const handleAllowanceCancel = () => {
    setEditedAllowance(state.monthlyAllowance > 0 ? state.monthlyAllowance.toString() : '');
    setIsEditingAllowance(false);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setExportFeedback(null);

    setTimeout(() => {
      try {
        const result = exportTransactionsToCSV(state.transactions, state.user.name);
        setIsExporting(false);
        setExportFeedback(state.language === 'HIN' 
          ? `${result.count} लेन-देन CSV फ़ाइल में डाउनलोड हो गए` 
          : `Exported ${result.count} transactions to CSV`);
        
        setTimeout(() => {
          setExportFeedback(null);
        }, 4500);
      } catch (err) {
        setIsExporting(false);
        setExportFeedback(state.language === 'HIN' ? 'निर्यात विफल रहा' : 'Export failed. Please try again.');
      }
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col relative h-full">
      <div className="fixed inset-0 z-40 bg-[#0a0907]/80 backdrop-blur-[6px]" onClick={onBack}></div>
      <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center pointer-events-none p-0 md:p-6">
        <div className="pointer-events-auto w-full md:max-w-2xl lg:max-w-3xl glass bg-background-light/98 dark:bg-[#121110]/98 rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] border border-slate-200 dark:border-white/10">
          <div className="flex md:hidden w-full items-center justify-center pt-3 pb-1">
            <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600/50"></div>
          </div>
          
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/5">
            <div className="flex flex-col">
              <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Settings</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">Account & Preferences</span>
            </div>
            <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full glass border border-slate-200 dark:border-white/5 hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-slate-400">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 pb-12 no-scrollbar">
            {/* User Info Snippet */}
            <div className="flex flex-col gap-5 p-5 glass rounded-2xl mt-4 border border-slate-200 dark:border-white/5 bg-slate-500/5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative group shrink-0">
                    <div className="size-16 rounded-full overflow-hidden ring-2 ring-primary/25 bg-slate-100 dark:bg-white/5 flex items-center justify-center relative">
                      {editedAvatar ? (
                        <img src={editedAvatar} className="size-full object-cover" alt="Profile Preview" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="material-symbols-outlined text-slate-400 text-3xl">person</span>
                      )}
                    </div>
                    {isEditing && (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:bg-black/70"
                        title="Upload customized photo"
                      >
                        <span className="material-symbols-outlined text-white text-lg">add_a_photo</span>
                      </button>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-primary">Your Nickname</label>
                        <input 
                          type="text" 
                          value={editedName} 
                          onChange={(e) => setEditedName(e.target.value)}
                          className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-primary w-full font-bold"
                          placeholder="Your beautiful name"
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="text-slate-900 dark:text-white font-black text-lg truncate leading-snug">{state.user.name}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Premium Student Member</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary text-background-dark rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all"
                      >
                        SAVE
                      </button>
                      <button 
                        onClick={handleEditCancel}
                        className="px-4 py-2 bg-white/5 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                      >
                        CANCEL
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 hover:bg-primary/20 border border-primary/30 text-primary hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                    >
                      EDIT
                    </button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Choose a Premium Portrait Avatar</p>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">cloud_upload</span> File Upload
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                    {PRESET_AVATARS.map((av) => {
                      const isSelected = editedAvatar === av.url;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => handlePresetSelect(av.url)}
                          className={`relative size-10 rounded-full overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-primary scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'}`}
                        >
                          <img src={av.url} className="size-full object-cover" alt={av.label} referrerPolicy="no-referrer" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Section: Monthly Allowance & Budget */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
                <h3 className="text-slate-800 dark:text-white text-sm font-bold uppercase tracking-wider opacity-80">
                  {state.language === 'HIN' ? 'मासिक बजट व भत्ता' : 'Budget & Allowance'}
                </h3>
              </div>

              <div className="glass rounded-2xl p-5 border border-slate-200 dark:border-white/5 space-y-4 bg-slate-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                      <span className="material-symbols-outlined text-2xl">wallet</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        {state.language === 'HIN' ? 'वर्तमान मासिक भत्ता' : 'Current Monthly Allowance'}
                      </span>
                      <p className="text-slate-900 dark:text-white text-xl font-black tracking-tight">
                        ₹{state.monthlyAllowance.toLocaleString()}
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">/ {state.language === 'HIN' ? 'माह' : 'month'}</span>
                      </p>
                    </div>
                  </div>

                  {!isEditingAllowance && (
                    <button
                      onClick={() => {
                        setEditedAllowance(state.monthlyAllowance > 0 ? state.monthlyAllowance.toString() : '');
                        setIsEditingAllowance(true);
                      }}
                      className="px-4 py-2 bg-primary text-background-dark rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      {state.language === 'HIN' ? 'बदलें' : 'Change'}
                    </button>
                  )}
                </div>

                {isEditingAllowance && (
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-3.5 animate-in fade-in">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-primary block mb-1.5">
                        {state.language === 'HIN' ? 'नया मासिक भत्ता दर्ज करें (₹)' : 'Enter New Monthly Allowance (₹)'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-lg">₹</span>
                        <input
                          type="number"
                          value={editedAllowance}
                          onChange={(e) => setEditedAllowance(e.target.value)}
                          placeholder="e.g. 15000"
                          className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-base text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-primary w-full font-black tracking-tight"
                        />
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">
                        {state.language === 'HIN' ? 'त्वरित चयन:' : 'Quick Presets:'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[5000, 10000, 15000, 20000, 25000, 50000].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setEditedAllowance(preset.toString())}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              editedAllowance === preset.toString()
                                ? 'bg-primary text-background-dark shadow-md'
                                : 'bg-slate-200/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-primary/20'
                            }`}
                          >
                            ₹{preset.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Save & Cancel Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveAllowance}
                        disabled={!editedAllowance || Number(editedAllowance) <= 0}
                        className="flex-1 py-2.5 bg-primary text-background-dark rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {state.language === 'HIN' ? 'सहेजें' : 'Save Allowance'}
                      </button>
                      <button
                        type="button"
                        onClick={handleAllowanceCancel}
                        className="px-4 py-2.5 bg-slate-200/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                      >
                        {state.language === 'HIN' ? 'रद्द करें' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Feedback Notification */}
                {allowanceFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>{allowanceFeedback}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Appearance & Localization */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm">palette</span>
                <h3 className="text-slate-800 dark:text-white text-sm font-bold uppercase tracking-wider opacity-80">Preferences</h3>
              </div>
              <div className="space-y-3">
                {/* Theme Toggle */}
                <div 
                  onClick={onToggleTheme}
                  className="glass rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-slate-200 dark:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${state.isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-500'}`}>
                      <span className="material-symbols-outlined">{state.isDarkMode ? 'dark_mode' : 'light_mode'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-white font-semibold text-sm">{state.isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{state.isDarkMode ? 'Easy on the eyes' : 'Clear and bright'}</span>
                    </div>
                  </div>
                  <div className={`w-11 h-6 rounded-full relative transition-colors ${state.isDarkMode ? 'bg-primary' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 size-4 bg-background-dark rounded-full transition-all duration-300 ${state.isDarkMode ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>

                {/* Language Toggle */}
                <div 
                  onClick={onToggleLang}
                  className="glass rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-slate-200 dark:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">translate</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-white font-semibold text-sm">Language / भाषा</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">
                        {state.language === 'ENG' ? 'Currently English (EN)' : 'अभी हिंदी (HI) है'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-xs">
                      {state.language === 'ENG' ? 'EN' : 'HI'}
                    </span>
                    <span className="material-symbols-outlined text-slate-400 text-lg">sync</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Data & Export */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm">database</span>
                <h3 className="text-slate-800 dark:text-white text-sm font-bold uppercase tracking-wider opacity-80">
                  {state.language === 'HIN' ? 'डेटा और बैकअप' : 'Data & Backup'}
                </h3>
              </div>

              <div className="glass rounded-2xl p-5 border border-slate-200 dark:border-white/5 space-y-4 bg-slate-500/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                      <span className="material-symbols-outlined text-2xl">table_chart</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-slate-900 dark:text-white font-bold text-sm">
                          {state.language === 'HIN' ? 'लेन-देन इतिहास निर्यात करें' : 'Export Transaction History'}
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/25">
                          CSV
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-relaxed">
                        {state.language === 'HIN'
                          ? 'एक्सेल और स्प्रेडशीट के लिए पूर्ण लेन-देन विवरण, श्रेणियां और वर्गीकरण डाउनलोड करें।'
                          : 'Download full transaction logs, categories, dates, and impulsive vs. wise tags for Excel & Google Sheets.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-2.5 border border-slate-200/60 dark:border-white/5">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider block">
                      {state.language === 'HIN' ? 'कुल रिकॉर्ड्स' : 'Total Records'}
                    </span>
                    <span className="text-slate-900 dark:text-white text-sm font-black">
                      {state.transactions.length} {state.language === 'HIN' ? 'लेन-देन' : 'transactions'}
                    </span>
                  </div>
                  <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-2.5 border border-slate-200/60 dark:border-white/5">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider block">
                      {state.language === 'HIN' ? 'कुल खर्च राशि' : 'Logged Volume'}
                    </span>
                    <span className="text-primary text-sm font-black">
                      ₹{state.transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Export Action Button */}
                <button
                  onClick={handleExportCSV}
                  disabled={isExporting}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-background-dark hover:brightness-110 active:scale-[0.98] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    {isExporting ? 'hourglass_top' : 'download'}
                  </span>
                  <span>
                    {isExporting 
                      ? (state.language === 'HIN' ? 'तैयार हो रहा है...' : 'Generating CSV...') 
                      : (state.language === 'HIN' ? 'CSV डाउनलोड करें (.csv)' : 'Download CSV File')}
                  </span>
                </button>

                {/* Load / Reset Sample Data Button */}
                {onResetSampleData && (
                  <button
                    onClick={() => {
                      onResetSampleData();
                      setSampleFeedback(state.language === 'HIN'
                        ? 'नमूना डेटा सफलतापूर्वक लोड हो गया (Wise, Considerable, Impulsive)'
                        : 'Sample data loaded with Wise, Considerable & Impulsive purchases');
                      setTimeout(() => setSampleFeedback(null), 4000);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-primary text-base">dataset</span>
                    <span>
                      {state.language === 'HIN' ? 'नमूना विश्लेषण डेटा लोड करें' : 'Load Sample Analytics Data'}
                    </span>
                  </button>
                )}

                {/* Sample Feedback Toast */}
                {sampleFeedback && (
                  <div className="p-3 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>{sampleFeedback}</span>
                  </div>
                )}

                {/* Export Success Feedback Toast */}
                {exportFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>{exportFeedback}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section: General */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm">tune</span>
                <h3 className="text-slate-800 dark:text-white text-sm font-bold uppercase tracking-wider opacity-80">General</h3>
              </div>
              <div className="glass rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-white/5 border border-slate-200 dark:border-white/5">
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 text-left transition-colors">
                  <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">Notifications</span>
                  <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg">chevron_right</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 text-left transition-colors">
                  <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">Currency</span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-bold">INR (₹)</span>
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg">chevron_right</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer / Logout */}
            <div className="pt-4 pb-6">
              <button 
                onClick={onLogout}
                className="w-full group relative flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3.5 text-red-500 font-bold text-sm transition-all hover:bg-red-500/10 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sign Out
              </button>
              <div className="flex flex-col items-center justify-center gap-1.5 mt-6">
                <div className="size-6 rounded-lg overflow-hidden border border-white/10 opacity-80">
                  <img src="/logo.png" alt="WiseupAI Logo" className="size-full object-cover" />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-wider">WiseupAI v2.4.0 (Build 204)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
