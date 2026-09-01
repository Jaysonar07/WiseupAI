import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';

interface NavigationProps {
  currentScreen: AppState['currentScreen'];
  onNavigate: (screen: AppState['currentScreen']) => void;
  user?: AppState['user'];
  language?: AppState['language'];
  onToggleLang?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentScreen, 
  onNavigate,
  user,
  language,
  onToggleLang 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems: { screen: AppState['currentScreen']; label: string; icon: string; badge?: string }[] = [
    { screen: 'dashboard', label: 'Home', icon: 'home' },
    { screen: 'analytics', label: 'Stats', icon: 'analytics' },
    { screen: 'chat', label: 'Guru', icon: 'psychology' },
    { screen: 'offers', label: 'Offers', icon: 'local_offer' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* MOBILE BOTTOM NAVIGATION (< md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none w-full">
        <div className="w-full pointer-events-auto relative" ref={menuRef}>
          
          {/* Expanded Action Menu */}
          {isMenuOpen && (
            <div className="absolute -top-36 left-1/2 transform -translate-x-1/2 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
              <button 
                onClick={() => { onNavigate('manual_entry'); setIsMenuOpen(false); }}
                className="flex items-center gap-3 bg-[#1a1814] border border-white/10 px-5 py-3 rounded-2xl shadow-2xl transition-all active:scale-95 cursor-pointer"
              >
                <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">edit_note</span>
                </div>
                <span className="text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Add Manually</span>
              </button>
              <button 
                onClick={() => { onNavigate('scan'); setIsMenuOpen(false); }}
                className="flex items-center gap-3 bg-[#1a1814] border border-white/10 px-5 py-3 rounded-2xl shadow-2xl transition-all active:scale-95 cursor-pointer"
              >
                <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                </div>
                <span className="text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Scan Bill</span>
              </button>
            </div>
          )}

          <div className="relative pb-6 sm:pb-8 pt-3 px-4 sm:px-8 max-w-2xl mx-auto flex items-center justify-between bg-[#0a0a0f]/95 backdrop-blur-2xl border-t border-white/5 shadow-2xl">
            {/* Center FAB Action Button */}
            <div className="absolute -top-9 sm:-top-10 left-1/2 transform -translate-x-1/2">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative flex items-center justify-center size-14 sm:size-16 rounded-full bg-[#D0BB95] text-[#1a1a1a] shadow-[0_0_30px_rgba(208,187,149,0.3)] transition-all active:scale-95 border-[3px] border-[#0a0a0f] cursor-pointer ${isMenuOpen ? 'rotate-45' : ''}`}
                aria-label="Add transaction or scan receipt"
              >
                <span className="material-symbols-outlined text-xl sm:text-2xl font-black">receipt_long</span>
                <div className="absolute -inset-1 rounded-full border border-primary/20 animate-pulse pointer-events-none"></div>
              </button>
            </div>

            {navItems.map((item, index) => {
              const isActive = currentScreen === item.screen;
              return (
                <React.Fragment key={item.screen}>
                  {index === 2 && <div className="w-12 sm:w-16" />}
                  <button
                    onClick={() => { onNavigate(item.screen); setIsMenuOpen(false); }}
                    className={`flex flex-col items-center gap-1 w-12 sm:w-14 transition-all cursor-pointer ${isActive ? 'text-[#D0BB95]' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <span className={`material-symbols-outlined text-xl sm:text-2xl ${isActive ? 'filled' : ''}`}>{item.icon}</span>
                    <span className="text-[9px] sm:text-[10px] tracking-tight uppercase font-black">{item.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABLET / DESKTOP SIDEBAR NAVIGATION (md:) */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 xl:w-72 shrink-0 bg-[#121110]/95 backdrop-blur-xl rounded-3xl p-4 lg:p-6 border border-white/5 shadow-2xl sticky top-4 lg:top-6 md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] justify-between z-30">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="size-11 rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/40 shrink-0">
              <img src="/logo.png" alt="WiseupAI Logo" className="size-full object-cover" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg tracking-tight flex items-center gap-1.5">
                <span>Wiseup</span>
                <span className="text-primary text-xs px-1.5 py-0.5 rounded-md bg-primary/15 border border-primary/25">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Financial Companion</p>
            </div>
          </div>

          {/* User Profile Summary */}
          {user && (
            <div 
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all group"
            >
              <div className="relative size-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} className="size-full object-cover" alt={user.name} />
                ) : (
                  <span className="material-symbols-outlined text-slate-400">person</span>
                )}
                <div className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full border border-[#121110]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-black text-xs truncate group-hover:text-primary transition-colors">
                  {user.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate">Account Active</p>
              </div>
              <span className="material-symbols-outlined text-slate-500 text-sm group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </div>
          )}

          {/* Main Navigation Links */}
          <nav className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-3 block mb-2">
              Menu
            </span>
            {navItems.map((item) => {
              const isActive = currentScreen === item.screen;
              return (
                <button
                  key={item.screen}
                  onClick={() => onNavigate(item.screen)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${isActive ? 'filled' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto size-1.5 rounded-full bg-background-dark" />}
                </button>
              );
            })}

            {/* Smart Tools Extra Nav Item */}
            <button
              onClick={() => onNavigate('tools')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                currentScreen === 'tools'
                  ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${currentScreen === 'tools' ? 'filled' : ''}`}>
                calculate
              </span>
              <span>Smart Tools</span>
            </button>
          </nav>

          {/* Quick Action Buttons (Scan / Manual Entry) */}
          <div className="pt-2 space-y-2">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-3 block mb-1">
              Quick Log
            </span>
            <button
              onClick={() => onNavigate('scan')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/30 text-white hover:text-primary text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg text-primary">photo_camera</span>
              <span>Scan Bill Receipt</span>
            </button>
            <button
              onClick={() => onNavigate('manual_entry')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg text-slate-400">edit_note</span>
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="pt-4 border-t border-white/5">
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300 transition-all cursor-pointer border border-white/5"
            >
              <span className="material-symbols-outlined text-sm text-primary">translate</span>
              <span>{language === 'HIN' ? 'हिन्दी (HIN)' : 'English (ENG)'}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navigation;
