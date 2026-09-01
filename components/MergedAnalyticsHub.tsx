import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Transaction, Language, AppState } from '../types';
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Info, 
  Camera, 
  Edit3, 
  Flame, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ExpenseSourcePieChart from './ExpenseSourcePieChart';
import SpendingTrendsChart from './SpendingTrendsChart';

interface MergedAnalyticsHubProps {
  transactions: Transaction[];
  monthlyAllowance: number;
  language: Language;
  selectedMonthDate: Date;
  selectedMonthName: string;
  onAction?: (screen: AppState['currentScreen'], query?: string) => void;
}

const MergedAnalyticsHub: React.FC<MergedAnalyticsHubProps> = ({
  transactions,
  monthlyAllowance,
  language,
  selectedMonthDate,
  selectedMonthName,
  onAction
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const t = {
    ENG: {
      hubTitle: 'Financial Intelligence Hub',
      hubSubtitle: 'Swipe left to explore behavior, trajectory & calendar intensity',
      tabSource: 'Behavior Split',
      tabTrends: 'Spending Trends',
      tabIntensity: 'Spending Intensity',
      slide1Short: '1. Behavior Split',
      slide2Short: '2. Monthly Trends',
      slide3Short: '3. Intensity Heatmap',
      scrollHint: 'Swipe or click tabs to switch views',
      intensityTitle: 'Spending Intensity Calendar',
      intensitySubtitle: 'Daily spending density & impulsive trigger frequency',
      low: 'Low',
      high: 'High',
      impulsiveDays: 'Impulsive Days',
      safeStreak: 'Clean Streak',
      peakDay: 'Peak Spending Day',
      daysUnit: 'Days',
      askAiRhythm: 'Analyze my spending rhythm',
      chatWithGuru: 'Ask Guru about this pattern',
      noTxTitle: 'No expenses for this month yet',
      noTxDesc: 'Start recording expenses or scanning bills to unlock your daily intensity grid.',
    },
    HIN: {
      hubTitle: 'वित्तीय विश्लेषण हब',
      hubSubtitle: 'व्यवहार, रुझान और कैलेंडर तीव्रता देखने के लिए स्वाइप करें',
      tabSource: 'व्यवहार विभाजन',
      tabTrends: 'खर्च के रुझान',
      tabIntensity: 'खर्च की तीव्रता',
      slide1Short: '1. व्यवहार विभाजन',
      slide2Short: '2. मासिक रुझान',
      slide3Short: '3. तीव्रता हीटमैप',
      scrollHint: 'दृश्य बदलने के लिए स्वाइप करें या टैब दबाएं',
      intensityTitle: 'दैनिक खर्च तीव्रता कैलेंडर',
      intensitySubtitle: 'दैनिक खर्च का घनत्व और आवेगपूर्ण दिनों की आवृत्ति',
      low: 'कम',
      high: 'अधिक',
      impulsiveDays: 'लापरवाह दिन',
      safeStreak: 'समझदारी स्ट्रीक',
      peakDay: 'अधिकतम खर्च का दिन',
      daysUnit: 'दिन',
      askAiRhythm: 'मेरी खर्च की लय का विश्लेषण करें',
      chatWithGuru: 'गुरु से इस पैटर्न पर पूछें',
      noTxTitle: 'इस माह में अभी कोई खर्च नहीं है',
      noTxDesc: 'दैनिक तीव्रता ग्रिड देखने के लिए बिल स्कैन करें या खर्च जोड़ें।',
    }
  }[language];

  const tabs = [
    { id: 0, label: t.tabSource, icon: PieChartIcon, short: t.slide1Short },
    { id: 1, label: t.tabTrends, icon: TrendingUp, short: t.slide2Short },
    { id: 2, label: t.tabIntensity, icon: Calendar, short: t.slide3Short },
  ];

  // Sync scroll buttons & active tab based on scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Calculate nearest slide index
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== activeSlide && index >= 0 && index < tabs.length) {
      setActiveSlide(index);
    }

    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth'
    });
    setActiveSlide(index);
  };

  const scrollPrev = () => {
    if (activeSlide > 0) {
      scrollToSlide(activeSlide - 1);
    }
  };

  const scrollNext = () => {
    if (activeSlide < tabs.length - 1) {
      scrollToSlide(activeSlide + 1);
    }
  };

  // Filter current month transactions for heatmap
  const monthTransactions = useMemo(() => {
    const m = selectedMonthDate.getMonth();
    const y = selectedMonthDate.getFullYear();

    return transactions.filter(tx => {
      if (!tx.date) return false;
      const txDate = new Date(tx.date);
      return !isNaN(txDate.getTime()) && txDate.getMonth() === m && txDate.getFullYear() === y;
    });
  }, [transactions, selectedMonthDate]);

  // Compute Heatmap and Rhythm metrics
  const heatmapData = useMemo(() => {
    const daysInMonth = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth(), 1).getDay(); // 0 = Sunday
    
    // Monday as first day (0..6)
    const padding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days: Array<{ day: number | null; intensity: number; total: number; hasImpulsive: boolean; count: number }> = [];
    
    // Pad initial empty cells
    for (let i = 0; i < padding; i++) {
      days.push({ day: null, intensity: 0, total: 0, hasImpulsive: false, count: 0 });
    }
    
    let maxDaySpend = 0;
    let peakDayNumber = 1;
    let impulsiveDayCount = 0;

    for (let i = 1; i <= daysInMonth; i++) {
      const dayTxs = monthTransactions.filter(tx => new Date(tx.date).getDate() === i);
      const total = dayTxs.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const hasImpulsive = dayTxs.some(tx => tx.type === 'Impulsive');
      
      if (hasImpulsive) impulsiveDayCount++;
      if (total > maxDaySpend) {
        maxDaySpend = total;
        peakDayNumber = i;
      }

      let intensity = 0;
      if (total > 0) {
        if (hasImpulsive || total > 1500) intensity = 3; // High (Red)
        else if (total > 500) intensity = 2; // Mid (Emerald)
        else intensity = 1; // Low (Dark Emerald)
      }
      
      days.push({ day: i, intensity, total, hasImpulsive, count: dayTxs.length });
    }
    
    return {
      days,
      peakDayNumber,
      maxDaySpend,
      impulsiveDayCount,
      totalActiveDays: days.filter(d => d.day !== null && d.count > 0).length
    };
  }, [selectedMonthDate, monthTransactions]);

  const getIntensityClass = (level: number) => {
    switch (level) {
      case 3: return 'bg-[#ff5252] text-white shadow-sm shadow-[#ff5252]/20 font-black'; // High / Impulsive
      case 2: return 'bg-[#10b981] text-black font-black'; // Mid
      case 1: return 'bg-[#064e3b] text-[#10b981] font-bold'; // Low
      default: return 'bg-[#1a181b] text-slate-600 font-medium'; // None
    }
  };

  return (
    <div className="bg-[#121014] border border-white/10 rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D0BB95]/5 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(208,187,149,0.8)] animate-pulse"></span>
            <span className="text-primary/90 text-[10px] font-black uppercase tracking-[0.2em]">
              {t.hubTitle}
            </span>
          </div>
          <h2 className="text-white text-xl sm:text-2xl font-black tracking-tight">
            {tabs[activeSlide].label}
          </h2>
          <p className="text-slate-500 text-xs font-medium mt-0.5">
            {selectedMonthName} • {t.hubSubtitle}
          </p>
        </div>

        {/* Action Bar: Tab Selector & Slide Arrows */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Tab Buttons */}
          <div className="bg-[#1a171d] p-1 rounded-2xl border border-white/5 flex items-center gap-1 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSlide === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToSlide(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-background-dark shadow-md shadow-primary/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-background-dark' : 'text-slate-400'} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.id + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Left/Right Arrow Navigation */}
          <div className="flex items-center gap-1 bg-[#1a171d] p-1 rounded-2xl border border-white/5">
            <button
              onClick={scrollPrev}
              disabled={activeSlide === 0}
              title="Previous Analytics Panel"
              className={`size-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeSlide > 0 
                  ? 'text-white hover:bg-white/10 active:scale-95' 
                  : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-[11px] font-black text-slate-400 px-1">
              <span className="text-primary">{activeSlide + 1}</span>
              <span className="text-slate-600">/</span>
              <span>{tabs.length}</span>
            </div>
            <button
              onClick={scrollNext}
              disabled={activeSlide === tabs.length - 1}
              title="Next Analytics Panel"
              className={`size-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeSlide < tabs.length - 1 
                  ? 'text-white hover:bg-white/10 active:scale-95' 
                  : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Horizontal Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth w-full items-start"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* SLIDE 1: Expense Logging Source (AI Scanned Bill vs Manual Entry) */}
        <div className="w-full min-w-full shrink-0 snap-center px-0.5">
          <ExpenseSourcePieChart
            transactions={transactions}
            language={language}
            selectedMonthDate={selectedMonthDate}
            onNavigate={(screen) => onAction && onAction(screen)}
          />
        </div>

        {/* SLIDE 2: Spending Trends (Trajectory, Allowance & Impulse Splits) */}
        <div className="w-full min-w-full shrink-0 snap-center px-0.5">
          <SpendingTrendsChart
            transactions={transactions}
            monthlyAllowance={monthlyAllowance}
            language={language}
          />
        </div>

        {/* SLIDE 3: Spending Intensity (Calendar Heatmap & Rhythm) */}
        <div className="w-full min-w-full shrink-0 snap-center px-0.5">
          <div className="bg-[#141215] rounded-[2.5rem] p-6 sm:p-7 border border-white/5 shadow-2xl space-y-6">
            {/* Heatmap Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"></span>
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">{t.tabIntensity}</span>
                </div>
                <h3 className="text-white text-xl font-black tracking-tight uppercase">{t.intensityTitle}</h3>
                <p className="text-slate-500 text-xs font-medium">{t.intensitySubtitle}</p>
              </div>

              {/* Intensity Scale Legend */}
              <div className="flex items-center gap-2.5 bg-[#1a171d] px-3.5 py-1.5 rounded-xl border border-white/5 self-start sm:self-auto">
                <span className="text-[10px] font-black text-slate-500 uppercase">{t.low}</span>
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-[3px] bg-[#064e3b]" title="Low Spend (&lt; ₹500)"></div>
                  <div className="size-3 rounded-[3px] bg-[#10b981]" title="Medium Spend (₹500 - ₹1500)"></div>
                  <div className="size-3 rounded-[3px] bg-[#ff5252]" title="High / Impulsive Spend (&gt; ₹1500)"></div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase">{t.high}</span>
              </div>
            </div>

            {/* Grid & Calendar Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Calendar Grid Container */}
              <div className="lg:col-span-7 bg-[#19171b] p-5 sm:p-6 rounded-3xl border border-white/5 space-y-3">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} className="text-[11px] font-black text-slate-500 text-center uppercase tracking-wider">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
                  {heatmapData.days.map((item, idx) => (
                    <div 
                      key={idx}
                      title={item.day ? `Day ${item.day}: ₹${item.total.toLocaleString()} (${item.count} txns)` : ''}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[11px] sm:text-xs transition-all duration-300 hover:scale-105 ${getIntensityClass(item.intensity)} ${!item.day ? 'opacity-0 pointer-events-none' : 'cursor-pointer'}`}
                    >
                      <span>{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intensity Insights & Metrics */}
              <div className="lg:col-span-5 space-y-3.5">
                <div className="bg-[#19171b] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.safeStreak}</span>
                    <ShieldCheck size={16} className="text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black text-emerald-400 tracking-tight">12 {t.daysUnit}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Consecutive days without impulsive expenditures</p>
                </div>

                <div className="bg-[#19171b] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.impulsiveDays}</span>
                    <Flame size={16} className="text-red-400" />
                  </div>
                  <p className="text-2xl font-black text-red-400 tracking-tight">{heatmapData.impulsiveDayCount} {t.daysUnit}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Days with flaggable impulsive triggers</p>
                </div>

                {heatmapData.maxDaySpend > 0 && (
                  <div className="bg-[#19171b] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.peakDay}</span>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black text-white">Day {heatmapData.peakDayNumber}</p>
                      <span className="text-primary font-black text-sm">₹{heatmapData.maxDaySpend.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom AI Interaction Trigger */}
            {onAction && (
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Info size={14} className="text-primary" />
                  <span>Calendar heat map updates dynamically upon every receipt scan and manual entry.</span>
                </p>
                <button
                  onClick={() => onAction('chat', `Analyze my spending intensity heatmap for ${selectedMonthName}. Which days should I be more disciplined?`)}
                  className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-background-dark transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles size={14} />
                  <span>{t.chatWithGuru}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Indicator Dots & Swipe Helper */}
      <div className="flex items-center justify-between pt-1 px-2 border-t border-white/5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">
          {t.scrollHint}
        </span>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSlide(tab.id)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeSlide === tab.id
                  ? 'w-8 h-2 bg-primary shadow-[0_0_10px_rgba(208,187,149,0.6)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
              title={tab.label}
            />
          ))}
        </div>

        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
          {tabs[activeSlide].short}
        </span>
      </div>
    </div>
  );
};

export default MergedAnalyticsHub;
