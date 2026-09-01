
import React, { useState } from 'react';
import { Language } from '../types';
import { signInWithGoogle, mockLogin } from '../services/firebase';
import { Eye, EyeOff, User, Lock, LogIn, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WelcomeScreenProps {
  language: Language;
  onToggleLang: () => void;
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ language, onToggleLang }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (isGoogle = false) => {
    if (isLoggingIn) return;
    setError(null);
    setIsLoggingIn(true);
    
    try {
      if (isGoogle) {
        await signInWithGoogle();
      } else {
        // Validate sample account
        if (email.trim() === 'user@example.com' && password === 'User2026') {
          mockLogin('user@example.com', 'Jay Sonar');
        } else if (!email.trim() || !password) {
          setError('Please enter both email and password.');
          setIsLoggingIn(false);
          return;
        } else {
          setError('Invalid email or password. Use user@example.com / User2026');
          setIsLoggingIn(false);
          return;
        }
      }
    } catch (error: any) {
      console.error("Auth process error:", error);
      mockLogin('user@example.com', 'Jay Sonar');
    } finally {
      setTimeout(() => {
        setIsLoggingIn(false);
      }, 500);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 pt-12 bg-[#0a0907] font-display text-white relative overflow-y-auto no-scrollbar items-center text-center">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      {/* Top Logo Icon */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="size-16 rounded-2xl overflow-hidden border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.6)] mb-8 relative group"
      >
        <img src="/logo.png" alt="WiseupAI Logo" className="size-full object-cover" />
      </motion.div>

      {/* Hero Graphic */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full aspect-[16/10] rounded-[2.5rem] overflow-hidden relative mb-10 shadow-2xl border border-white/10 bg-[#060e0a]"
      >
        <img 
          src="/hero-chart.jpg" 
          className="absolute inset-0 w-full h-full object-cover object-center"
          alt="Financial Growth Chart"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0907]/90 via-[#0a0907]/20 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] pointer-events-none"></div>
        
        {/* AI Active Badge */}
        <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 bg-[#0d1512]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse"></span>
          <span className="text-[10px] font-bold text-slate-100 tracking-wide">AI Active</span>
        </div>
      </motion.div>

      {/* Welcome Heading */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-2 mb-10 px-4"
      >
        <h1 className="text-3xl font-black tracking-tight leading-tight">
          Welcome to <span className="text-[#5185ea]">WiseupAI</span>
        </h1>
        <h2 className="text-xl font-bold text-[#b0b0b0]">
          WiseupAI में आपका स्वागत है
        </h2>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider max-w-[90%] mx-auto mt-3">
          Financial Literacy Powered by AI
        </p>
      </motion.div>

      {/* Credentials Form */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full space-y-4 px-2"
      >
        {/* Sample Credentials Hint */}
        <div 
          onClick={() => {
            setEmail('user@example.com');
            setPassword('User2026');
          }}
          className="bg-[#181a20]/90 border border-white/10 rounded-xl px-4 py-2.5 text-center text-xs text-slate-300 shadow-sm cursor-pointer hover:border-primary/40 hover:bg-[#1f222a] transition-all group"
          title="Click to auto-fill sample credentials"
        >
          <p className="font-medium text-slate-300">
            Use <span className="text-white font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded group-hover:text-primary transition-colors">user@example.com</span> for email and <span className="text-white font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded group-hover:text-primary transition-colors">User2026</span> for password
          </p>
        </div>

        <div className="space-y-3 w-full text-left">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-[#1e2025] border border-white/5 rounded-xl py-4 pl-11 pr-5 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-[#5185ea]/40 focus:border-[#5185ea]/20 outline-none transition-all"
            />
          </div>
          <div className="relative font-sans">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#1e2025] border border-white/5 rounded-xl py-4 pl-11 pr-12 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-[#5185ea]/40 focus:border-[#5185ea]/20 outline-none transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-[11px] font-bold"
          >
            {error}
          </motion.p>
        )}

        <div className="flex justify-end pr-1 mt-1">
          <button className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors">
            Forgot Password?
          </button>
        </div>

        <button 
          onClick={() => handleSignIn(false)}
          disabled={isLoggingIn}
          className="w-full py-4 bg-[#D0BB95] text-black rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#D0BB95]/10 active:scale-[0.98] transition-all hover:bg-[#c4af88]"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-4">
          <div className="h-[1px] flex-1 bg-white/5"></div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">OR CONTINUE WITH</span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>

        <button 
          onClick={() => handleSignIn(true)}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-3 py-4 bg-[#1a1c24] border border-white/10 rounded-xl font-bold transition-all active:scale-[0.98] hover:bg-[#20232d]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-sm tracking-tight">Continue with Google</span>
        </button>
      </motion.div>

      {/* Language Selection */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex items-center bg-[#1a1c24] p-1 rounded-2xl border border-white/5"
      >
        <button 
          onClick={() => language === 'HIN' && onToggleLang()}
          className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${language === 'ENG' ? 'bg-[#3b4252] text-white' : 'text-slate-500'}`}
        >
          ENG
        </button>
        <button 
          onClick={() => language === 'ENG' && onToggleLang()}
          className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${language === 'HIN' ? 'bg-[#3b4252] text-white' : 'text-slate-500'}`}
        >
          हिंदी
        </button>
      </motion.div>

      {/* Footer Disclaimer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 pb-6 text-[10px] text-slate-500 font-bold leading-relaxed tracking-wide"
      >
        By continuing, you agree to WiseupAI's <br/>
        <span className="underline decoration-slate-600/50 cursor-pointer">Terms of Service</span> & <span className="underline decoration-slate-600/50 cursor-pointer">Privacy Policy</span>.
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
