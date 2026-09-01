import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';
import { Transaction, Language } from '../types';
import { ShieldCheck, Flame, AlertCircle, Sparkles, SlidersHorizontal, ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface ExpenseSourcePieChartProps {
  transactions: Transaction[];
  language: Language;
  selectedMonthDate?: Date;
  onNavigate?: (screen: 'scan' | 'manual_entry') => void;
}

type MetricMode = 'amount' | 'count';
type ScopeMode = 'month' | 'all';

interface BehaviorSliceData {
  name: string;
  key: 'wise' | 'considerable' | 'impulsive';
  value: number;
  count: number;
  percentage: number;
  color: string;
  gradientId: string;
  icon: any;
  avgAmount: number;
  labelEn: string;
  labelHi: string;
  subEn: string;
  subHi: string;
  badgeEn: string;
  badgeHi: string;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 12px ${fill}88)` }}
      />
    </g>
  );
};

const ExpenseSourcePieChart: React.FC<ExpenseSourcePieChartProps> = ({
  transactions,
  language,
  selectedMonthDate,
  onNavigate
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('amount');
  const [scopeMode, setScopeMode] = useState<ScopeMode>('month');
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const t = {
    ENG: {
      title: 'Expense Behavior Split',
      subtitle: 'Analysis and distribution of Wise, Considerable & Impulsive expenses',
      wise: 'Wise Expenses',
      considerable: 'Considerable',
      impulsive: 'Impulsive Spends',
      byAmount: 'Amount (₹)',
      byCount: 'Count (#)',
      thisMonth: 'Selected Month',
      allTime: 'All Time',
      totalSpent: 'Total Spend',
      totalTxs: 'Total Txns',
      avgSpent: 'Avg Spend',
      wiseSub: 'Essential, planned & smart moves',
      considerableSub: 'Needs moderation & reflection',
      impulsiveSub: 'Spontaneous & unplanned triggers',
      wiseBadge: 'Smart Move',
      considerableBadge: 'Moderate',
      impulsiveBadge: 'Impulse Trigger',
      noDataTitle: 'No expenses recorded yet',
      noDataDesc: 'Log your expenses to see your Wise, Considerable, and Impulsive behavior distribution.',
      logExpenseBtn: 'Log Expense',
      scanBillBtn: 'Scan Receipt',
      behaviorBalance: 'Behavior Balance Ratio',
      disciplineScore: 'Financial Discipline',
    },
    HIN: {
      title: 'खर्च व्यवहार विभाजन',
      subtitle: 'समझदारी, महत्वपूर्ण और लापरवाह खर्चों का संपूर्ण वित्तीय विश्लेषण',
      wise: 'समझदारी खर्च (Wise)',
      considerable: 'महत्वपूर्ण खर्च (Considerable)',
      impulsive: 'लापरवाह खर्च (Impulsive)',
      byAmount: 'राशि (₹)',
      byCount: 'संख्या (#)',
      thisMonth: 'चयनित माह',
      allTime: 'कुल समय',
      totalSpent: 'कुल खर्च',
      totalTxs: 'कुल प्रविष्टियां',
      avgSpent: 'औसत खर्च',
      wiseSub: 'आवश्यक, योजनाबद्ध एवं समझदार खर्च',
      considerableSub: 'संतुलन और संयम की आवश्यकता',
      impulsiveSub: 'अनावश्यक एवं आवेगपूर्ण खर्च',
      wiseBadge: 'समझदारी',
      considerableBadge: 'संतुलित',
      impulsiveBadge: 'लापरवाह',
      noDataTitle: 'अभी तक कोई खर्च दर्ज नहीं',
      noDataDesc: 'खर्च जोड़ें ताकि समझदारी और लापरवाह खर्चों का विश्लेषण देख सकें।',
      logExpenseBtn: 'खर्च जोड़ें',
      scanBillBtn: 'रसीद स्कैन करें',
      behaviorBalance: 'व्यवहार संतुलन अनुपात',
      disciplineScore: 'वित्तीय अनुशासन',
    }
  }[language];

  // Filter transactions based on scope
  const targetTransactions = useMemo(() => {
    if (scopeMode === 'all') {
      return transactions;
    }
    const targetDate = selectedMonthDate || new Date();
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    return transactions.filter(tx => {
      if (!tx.date) return false;
      const d = new Date(tx.date);
      return !isNaN(d.getTime()) && d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    });
  }, [transactions, scopeMode, selectedMonthDate]);

  // Calculate Wise, Considerable, Impulsive analytics
  const stats = useMemo(() => {
    let wiseTotal = 0;
    let wiseCount = 0;
    let considerableTotal = 0;
    let considerableCount = 0;
    let impulsiveTotal = 0;
    let impulsiveCount = 0;

    targetTransactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'Wise') {
        wiseTotal += amt;
        wiseCount += 1;
      } else if (tx.type === 'Considerable') {
        considerableTotal += amt;
        considerableCount += 1;
      } else {
        impulsiveTotal += amt;
        impulsiveCount += 1;
      }
    });

    const totalAmount = wiseTotal + considerableTotal + impulsiveTotal;
    const totalCount = wiseCount + considerableCount + impulsiveCount;

    const wiseAmountPct = totalAmount > 0 ? Math.round((wiseTotal / totalAmount) * 100) : 0;
    const considerableAmountPct = totalAmount > 0 ? Math.round((considerableTotal / totalAmount) * 100) : 0;
    const impulsiveAmountPct = totalAmount > 0 ? Math.max(0, 100 - wiseAmountPct - considerableAmountPct) : 0;

    const wiseCountPct = totalCount > 0 ? Math.round((wiseCount / totalCount) * 100) : 0;
    const considerableCountPct = totalCount > 0 ? Math.round((considerableCount / totalCount) * 100) : 0;
    const impulsiveCountPct = totalCount > 0 ? Math.max(0, 100 - wiseCountPct - considerableCountPct) : 0;

    const behaviorData: BehaviorSliceData[] = [
      {
        name: t.wise,
        key: 'wise',
        value: metricMode === 'amount' ? wiseTotal : wiseCount,
        count: wiseCount,
        percentage: metricMode === 'amount' ? wiseAmountPct : wiseCountPct,
        color: '#10B981', // Emerald
        gradientId: 'wiseGradient',
        icon: ShieldCheck,
        avgAmount: wiseCount > 0 ? Math.round(wiseTotal / wiseCount) : 0,
        labelEn: 'Wise Spends',
        labelHi: 'समझदारी खर्च',
        subEn: t.wiseSub,
        subHi: t.wiseSub,
        badgeEn: t.wiseBadge,
        badgeHi: t.wiseBadge
      },
      {
        name: t.considerable,
        key: 'considerable',
        value: metricMode === 'amount' ? considerableTotal : considerableCount,
        count: considerableCount,
        percentage: metricMode === 'amount' ? considerableAmountPct : considerableCountPct,
        color: '#F59E0B', // Amber
        gradientId: 'considerableGradient',
        icon: AlertCircle,
        avgAmount: considerableCount > 0 ? Math.round(considerableTotal / considerableCount) : 0,
        labelEn: 'Considerable',
        labelHi: 'महत्वपूर्ण खर्च',
        subEn: t.considerableSub,
        subHi: t.considerableSub,
        badgeEn: t.considerableBadge,
        badgeHi: t.considerableBadge
      },
      {
        name: t.impulsive,
        key: 'impulsive',
        value: metricMode === 'amount' ? impulsiveTotal : impulsiveCount,
        count: impulsiveCount,
        percentage: metricMode === 'amount' ? impulsiveAmountPct : impulsiveCountPct,
        color: '#EF4444', // Red
        gradientId: 'impulsiveGradient',
        icon: Flame,
        avgAmount: impulsiveCount > 0 ? Math.round(impulsiveTotal / impulsiveCount) : 0,
        labelEn: 'Impulsive Spends',
        labelHi: 'लापरवाह खर्च',
        subEn: t.impulsiveSub,
        subHi: t.impulsiveSub,
        badgeEn: t.impulsiveBadge,
        badgeHi: t.impulsiveBadge
      }
    ].filter(item => item.value > 0 || (totalAmount === 0 && totalCount === 0));

    return {
      wiseTotal,
      wiseCount,
      wiseAmountPct,
      wiseCountPct,
      considerableTotal,
      considerableCount,
      considerableAmountPct,
      considerableCountPct,
      impulsiveTotal,
      impulsiveCount,
      impulsiveAmountPct,
      impulsiveCountPct,
      totalAmount,
      totalCount,
      behaviorData
    };
  }, [targetTransactions, metricMode, t]);

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const slice: BehaviorSliceData = payload[0]?.payload;
    if (!slice) return null;

    return (
      <div className="bg-[#181716] border border-white/15 p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl min-w-[210px] space-y-2 z-50">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: slice.color }}></span>
            <p className="text-white text-xs font-black uppercase tracking-wider">{slice.name}</p>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: `${slice.color}22`, color: slice.color }}>
            {slice.percentage}%
          </span>
        </div>

        <div className="space-y-1.5 pt-0.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">{t.byAmount}:</span>
            <span className="font-black text-white">
              ₹{(slice.key === 'wise' ? stats.wiseTotal : slice.key === 'considerable' ? stats.considerableTotal : stats.impulsiveTotal).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">{t.totalTxs}:</span>
            <span className="font-bold text-slate-300">{slice.count} {language === 'HIN' ? 'लेनदेन' : 'txns'}</span>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-1">
            <span className="text-slate-400 font-medium">{t.avgSpent}:</span>
            <span className="font-black" style={{ color: slice.color }}>₹{slice.avgAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  const hasData = stats.totalAmount > 0 || stats.totalCount > 0;

  return (
    <section className="bg-[#141215] rounded-[2.5rem] p-6 sm:p-7 border border-white/5 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/5 rounded-full blur-[90px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EF4444]/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#F59E0B]/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse"></span>
            <span className="text-emerald-400/90 text-[10px] font-black uppercase tracking-[0.2em]">{t.title}</span>
          </div>
          <h3 className="text-white text-xl font-black tracking-tight uppercase">{t.title}</h3>
          <p className="text-slate-500 text-xs font-medium">{t.subtitle}</p>
        </div>

        {/* Action Controls: Scope and Metric Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scope Toggle: Selected Month vs All Time */}
          <div className="bg-[#1c1a1f] p-1 rounded-xl border border-white/5 flex items-center gap-1">
            <button
              onClick={() => setScopeMode('month')}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                scopeMode === 'month'
                  ? 'bg-primary text-background-dark shadow-md shadow-primary/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.thisMonth}
            </button>
            <button
              onClick={() => setScopeMode('all')}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                scopeMode === 'all'
                  ? 'bg-primary text-background-dark shadow-md shadow-primary/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.allTime}
            </button>
          </div>

          {/* Metric Mode Toggle (₹ Amount vs # Count) */}
          <div className="bg-[#1c1a1f] p-1 rounded-xl border border-white/5 flex items-center gap-1">
            <button
              onClick={() => setMetricMode('amount')}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                metricMode === 'amount'
                  ? 'bg-white/15 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              ₹ {language === 'HIN' ? 'राशि' : 'Value'}
            </button>
            <button
              onClick={() => setMetricMode('count')}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                metricMode === 'count'
                  ? 'bg-white/15 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              # {language === 'HIN' ? 'संख्या' : 'Count'}
            </button>
          </div>
        </div>
      </div>

      {hasData ? (
        <div className="space-y-6">
          {/* Top 3-Way Summary Bar for Wise, Considerable, Impulsive */}
          <div className="bg-[#18161b] rounded-2xl p-4 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <SlidersHorizontal size={13} className="text-primary" />
                {t.behaviorBalance}
              </span>
              <span className="text-xs font-black text-white">
                ₹{stats.totalAmount.toLocaleString()} ({stats.totalCount} {language === 'HIN' ? 'लेनदेन' : 'txns'})
              </span>
            </div>

            {/* Proportion Progress Bar */}
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5 p-0.5">
              <div
                style={{ width: `${stats.wiseAmountPct}%` }}
                className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                title={`Wise: ₹${stats.wiseTotal.toLocaleString()} (${stats.wiseAmountPct}%)`}
              ></div>
              <div
                style={{ width: `${stats.considerableAmountPct}%` }}
                className="h-full bg-amber-500 transition-all duration-500"
                title={`Considerable: ₹${stats.considerableTotal.toLocaleString()} (${stats.considerableAmountPct}%)`}
              ></div>
              <div
                style={{ width: `${stats.impulsiveAmountPct}%` }}
                className="h-full bg-red-500 rounded-r-full transition-all duration-500"
                title={`Impulsive: ₹${stats.impulsiveTotal.toLocaleString()} (${stats.impulsiveAmountPct}%)`}
              ></div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400"></span>
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider">Wise</span>
                </div>
                <p className="text-white font-black text-xs sm:text-sm">₹{stats.wiseTotal.toLocaleString()}</p>
                <p className="text-[9px] text-emerald-400/80 font-bold">{stats.wiseAmountPct}% • {stats.wiseCount} txns</p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-400"></span>
                  <span className="text-amber-400 text-[10px] font-black uppercase tracking-wider">Considerable</span>
                </div>
                <p className="text-white font-black text-xs sm:text-sm">₹{stats.considerableTotal.toLocaleString()}</p>
                <p className="text-[9px] text-amber-400/80 font-bold">{stats.considerableAmountPct}% • {stats.considerableCount} txns</p>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-red-400"></span>
                  <span className="text-red-400 text-[10px] font-black uppercase tracking-wider">Impulsive</span>
                </div>
                <p className="text-white font-black text-xs sm:text-sm">₹{stats.impulsiveTotal.toLocaleString()}</p>
                <p className="text-[9px] text-red-400/80 font-bold">{stats.impulsiveAmountPct}% • {stats.impulsiveCount} txns</p>
              </div>
            </div>
          </div>

          {/* Main Visual: Donut Chart + Interactive Detail Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Donut Chart Container */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
              <div className="w-full h-64 sm:h-72 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="wiseGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="considerableGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>
                      <linearGradient id="impulsiveGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F87171" />
                        <stop offset="100%" stopColor="#DC2626" />
                      </linearGradient>
                    </defs>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={stats.behaviorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={96}
                      paddingAngle={4}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(undefined)}
                      cursor="pointer"
                    >
                      {stats.behaviorData.map((entry) => (
                        <Cell
                          key={`cell-${entry.key}`}
                          fill={`url(#${entry.gradientId})`}
                          stroke="rgba(0,0,0,0.6)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                  {activeIndex !== undefined && stats.behaviorData[activeIndex] ? (
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-0.5"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: stats.behaviorData[activeIndex].color }}>
                        {stats.behaviorData[activeIndex].name}
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {metricMode === 'amount'
                          ? `₹${(stats.behaviorData[activeIndex].key === 'wise' ? stats.wiseTotal : stats.behaviorData[activeIndex].key === 'considerable' ? stats.considerableTotal : stats.impulsiveTotal).toLocaleString()}`
                          : `${stats.behaviorData[activeIndex].count} txns`}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400">
                        {stats.behaviorData[activeIndex].percentage}% of total
                      </span>
                    </motion.div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        {metricMode === 'amount' ? t.totalSpent : t.totalTxs}
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {metricMode === 'amount'
                          ? `₹${stats.totalAmount.toLocaleString()}`
                          : `${stats.totalCount}`}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {stats.wiseAmountPct}% Wise Discipline
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Interactive Cards (Wise, Considerable, Impulsive) */}
            <div className="lg:col-span-6 space-y-3">
              {/* Wise Card */}
              <div
                onMouseEnter={() => {
                  const idx = stats.behaviorData.findIndex(d => d.key === 'wise');
                  if (idx !== -1) setActiveIndex(idx);
                }}
                onMouseLeave={() => setActiveIndex(undefined)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  activeIndex !== undefined && stats.behaviorData[activeIndex]?.key === 'wise'
                    ? 'bg-[#132219] border-emerald-500/60 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                    : 'bg-[#18161b] border-white/5 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white text-xs sm:text-sm font-black tracking-tight">{t.wise}</h4>
                        <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {t.wiseBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{t.wiseSub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-emerald-400 tracking-tight">
                      ₹{stats.wiseTotal.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold">{stats.wiseAmountPct}% • {stats.wiseCount} txns</p>
                  </div>
                </div>
              </div>

              {/* Considerable Card */}
              <div
                onMouseEnter={() => {
                  const idx = stats.behaviorData.findIndex(d => d.key === 'considerable');
                  if (idx !== -1) setActiveIndex(idx);
                }}
                onMouseLeave={() => setActiveIndex(undefined)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  activeIndex !== undefined && stats.behaviorData[activeIndex]?.key === 'considerable'
                    ? 'bg-[#261f12] border-amber-500/60 shadow-lg shadow-amber-500/10 scale-[1.01]'
                    : 'bg-[#18161b] border-white/5 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white text-xs sm:text-sm font-black tracking-tight">{t.considerable}</h4>
                        <span className="bg-amber-500/15 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {t.considerableBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{t.considerableSub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-amber-400 tracking-tight">
                      ₹{stats.considerableTotal.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold">{stats.considerableAmountPct}% • {stats.considerableCount} txns</p>
                  </div>
                </div>
              </div>

              {/* Impulsive Card */}
              <div
                onMouseEnter={() => {
                  const idx = stats.behaviorData.findIndex(d => d.key === 'impulsive');
                  if (idx !== -1) setActiveIndex(idx);
                }}
                onMouseLeave={() => setActiveIndex(undefined)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  activeIndex !== undefined && stats.behaviorData[activeIndex]?.key === 'impulsive'
                    ? 'bg-[#291417] border-red-500/60 shadow-lg shadow-red-500/10 scale-[1.01]'
                    : 'bg-[#18161b] border-white/5 hover:border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                      <Flame size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white text-xs sm:text-sm font-black tracking-tight">{t.impulsive}</h4>
                        <span className="bg-red-500/15 text-red-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {t.impulsiveBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{t.impulsiveSub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-red-400 tracking-tight">
                      ₹{stats.impulsiveTotal.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold">{stats.impulsiveAmountPct}% • {stats.impulsiveCount} txns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action / Status Footer */}
          {onNavigate && (
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/5 gap-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Sparkles size={14} className="text-primary" />
                <span className="font-medium">
                  {stats.impulsiveCount === 0
                    ? 'Outstanding! You maintained 100% discipline with 0 impulsive expenses.'
                    : `Tip: ₹${stats.impulsiveTotal.toLocaleString()} spent on impulse (${stats.impulsiveAmountPct}% of total). Ask Guru for saving strategies.`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('manual_entry')}
                  className="px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-background-dark transition-all flex items-center gap-1 cursor-pointer"
                >
                  <TrendingUp size={13} />
                  <span>{t.logExpenseBtn}</span>
                </button>
                <button
                  onClick={() => onNavigate('scan')}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-black uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck size={13} />
                  <span>{t.scanBillBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 px-4 text-center space-y-4">
          <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
            <ShieldCheck size={28} />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-white text-base font-black uppercase tracking-tight">{t.noDataTitle}</h4>
            <p className="text-slate-400 text-xs leading-relaxed">{t.noDataDesc}</p>
          </div>
          {onNavigate && (
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('manual_entry')}
                className="px-5 py-2.5 rounded-2xl bg-primary text-background-dark font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <TrendingUp size={14} />
                <span>{t.logExpenseBtn}</span>
              </button>
              <button
                onClick={() => onNavigate('scan')}
                className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck size={14} />
                <span>{t.scanBillBtn}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ExpenseSourcePieChart;
