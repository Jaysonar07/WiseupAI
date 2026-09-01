import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { Transaction, Language } from '../types';

interface SpendingTrendsChartProps {
  transactions: Transaction[];
  monthlyAllowance: number;
  language: Language;
  onNavigateToAnalytics?: () => void;
}

type Timeframe = '3M' | '6M' | '1Y';
type ViewMode = 'total' | 'split';

interface MonthDataPoint {
  monthKey: string; // e.g. '2026-03'
  shortLabel: string; // e.g. 'Mar' / 'मार्च'
  fullLabel: string;
  total: number;
  wise: number;
  considerable: number;
  impulsive: number;
  count: number;
}

const SpendingTrendsChart: React.FC<SpendingTrendsChartProps> = ({
  transactions,
  monthlyAllowance,
  language,
  onNavigateToAnalytics
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('6M');
  const [viewMode, setViewMode] = useState<ViewMode>('total');

  const monthCount = timeframe === '3M' ? 3 : timeframe === '6M' ? 6 : 12;

  const t = {
    ENG: {
      title: 'Spending Trends',
      subtitle: 'Monthly financial trajectory & classification analysis',
      totalSpend: 'Total Spent',
      wiseSpend: 'Wise',
      considerableSpend: 'Considerable',
      impulsiveSpend: 'Impulsive',
      allowanceLimit: 'Allowance',
      avgPerMonth: 'Avg / Mo',
      vsLastMonth: 'vs Last Mo',
      viewTotal: 'Total',
      viewSplit: 'Breakdown',
      noDataTitle: 'Start Logging Expenses',
      noDataDesc: 'Your monthly spending curve will form automatically as you scan bills and add expenses.',
      topCategory: 'Top Category',
      highestMonth: 'Peak Month',
      budgetStatus: 'Budget Status',
      withinBudget: 'Within Allowance',
      overBudget: 'Over Allowance',
      viewFullStats: 'Detailed Analytics',
    },
    HIN: {
      title: 'खर्च के रुझान',
      subtitle: 'मासिक वित्तीय दिशा और वर्गीकरण का विश्लेषण',
      totalSpend: 'कुल खर्च',
      wiseSpend: 'समझदारी',
      considerableSpend: 'महत्वपूर्ण',
      impulsiveSpend: 'लापरवाह',
      allowanceLimit: 'मासिक भत्ता',
      avgPerMonth: 'औसत / माह',
      vsLastMonth: 'पिछले माह की तुलना',
      viewTotal: 'कुल',
      viewSplit: 'विभाजन',
      noDataTitle: 'खर्च जोड़ना शुरू करें',
      noDataDesc: 'जैसे ही आप बिल स्कैन करेंगे या खर्च दर्ज करेंगे, आपका मासिक ग्राफ तैयार हो जाएगा।',
      topCategory: 'शीर्ष श्रेणी',
      highestMonth: 'अधिकतम माह',
      budgetStatus: 'बजट स्थिति',
      withinBudget: 'बजट के भीतर',
      overBudget: 'बजट से अधिक',
      viewFullStats: 'विस्तृत विश्लेषण',
    }
  }[language];

  // Generate monthly aggregated data
  const chartData = useMemo<MonthDataPoint[]>(() => {
    const data: MonthDataPoint[] = [];
    const now = new Date();

    for (let i = monthCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

      // Localized short and full month name
      const shortLabel = d.toLocaleString(language === 'HIN' ? 'hi-IN' : 'en-US', { month: 'short' });
      const fullLabel = d.toLocaleString(language === 'HIN' ? 'hi-IN' : 'en-US', { month: 'long', year: 'numeric' });

      // Filter transactions matching this month
      const matchingTxs = transactions.filter(tx => {
        if (!tx.date) return false;
        const txDate = new Date(tx.date);
        return !isNaN(txDate.getTime()) && txDate.getFullYear() === year && txDate.getMonth() === month;
      });

      let total = 0;
      let wise = 0;
      let considerable = 0;
      let impulsive = 0;

      matchingTxs.forEach(tx => {
        const amt = Number(tx.amount) || 0;
        total += amt;
        if (tx.type === 'Impulsive') {
          impulsive += amt;
        } else if (tx.type === 'Considerable') {
          considerable += amt;
        } else {
          wise += amt;
        }
      });

      data.push({
        monthKey,
        shortLabel,
        fullLabel,
        total,
        wise,
        considerable,
        impulsive,
        count: matchingTxs.length
      });
    }

    return data;
  }, [transactions, monthCount, language]);

  // Compute key trend summary metrics
  const stats = useMemo(() => {
    const totalInPeriod = chartData.reduce((acc, curr) => acc + curr.total, 0);
    const avgMonthly = Math.round(totalInPeriod / (chartData.length || 1));
    
    // Compare current month with previous month
    const currentMonthData = chartData[chartData.length - 1];
    const prevMonthData = chartData.length > 1 ? chartData[chartData.length - 2] : null;

    let deltaPercent = 0;
    if (prevMonthData && prevMonthData.total > 0) {
      deltaPercent = Math.round(((currentMonthData.total - prevMonthData.total) / prevMonthData.total) * 100);
    } else if (prevMonthData && prevMonthData.total === 0 && currentMonthData.total > 0) {
      deltaPercent = 100;
    }

    // Find peak month
    let peakMonth = chartData[0];
    chartData.forEach(item => {
      if (item.total > (peakMonth?.total || 0)) {
        peakMonth = item;
      }
    });

    const totalImpulsiveInPeriod = chartData.reduce((acc, curr) => acc + curr.impulsive, 0);
    const impulseRatio = totalInPeriod > 0 ? Math.round((totalImpulsiveInPeriod / totalInPeriod) * 100) : 0;

    return {
      totalInPeriod,
      avgMonthly,
      currentTotal: currentMonthData?.total || 0,
      deltaPercent,
      peakMonthLabel: peakMonth?.shortLabel || '',
      peakMonthTotal: peakMonth?.total || 0,
      impulseRatio
    };
  }, [chartData]);

  // Max value for Y-axis scaling
  const maxSpend = useMemo(() => {
    const highestDataVal = Math.max(...chartData.map(d => d.total), 0);
    const threshold = Math.max(highestDataVal, monthlyAllowance);
    return threshold > 0 ? Math.ceil((threshold * 1.25) / 1000) * 1000 : 5000;
  }, [chartData, monthlyAllowance]);

  // Custom high-contrast Dark Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data: MonthDataPoint = payload[0]?.payload;
    if (!data) return null;

    const isOverAllowance = monthlyAllowance > 0 && data.total > monthlyAllowance;

    return (
      <div className="bg-[#181716] border border-white/15 p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl min-w-[210px] space-y-2 z-50">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <p className="text-white text-xs font-black uppercase tracking-wider">{data.fullLabel}</p>
          <span className="text-[10px] text-slate-400 font-bold">{data.count} {language === 'HIN' ? 'लेनदेन' : 'txns'}</span>
        </div>

        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-white"></span>
              {t.totalSpend}:
            </span>
            <span className="text-xs font-black text-white">₹{data.total.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#10b981]"></span>
              {t.wiseSpend}:
            </span>
            <span className="text-[11px] font-bold text-slate-300">₹{data.wise.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#D0BB95] flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#D0BB95]"></span>
              {t.considerableSpend}:
            </span>
            <span className="text-[11px] font-bold text-slate-300">₹{data.considerable.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-red-400 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#ff5252]"></span>
              {t.impulsiveSpend}:
            </span>
            <span className="text-[11px] font-bold text-slate-300">₹{data.impulsive.toLocaleString()}</span>
          </div>

          {monthlyAllowance > 0 && (
            <div className="pt-1.5 mt-1 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-bold">{t.allowanceLimit}:</span>
              <span className={isOverAllowance ? 'text-red-400 font-black' : 'text-emerald-400 font-black'}>
                ₹{monthlyAllowance.toLocaleString()} {isOverAllowance ? '⚠️' : '✓'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#121110] rounded-[2.5rem] p-6 sm:p-7 border border-white/5 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(208,187,149,0.7)]"></div>
            <span className="text-primary/70 text-[10px] font-black uppercase tracking-[0.2em]">{t.title}</span>
          </div>
          <h3 className="text-white text-xl font-black tracking-tight uppercase">{t.title}</h3>
        </div>

        {/* Filters & Timeframe Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Timeframe selection */}
          <div className="bg-[#1c1b19] p-1 rounded-xl border border-white/5 flex items-center gap-1">
            {(['3M', '6M', '1Y'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  timeframe === tf 
                    ? 'bg-primary text-background-dark shadow-md shadow-primary/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Mode toggle */}
          <div className="bg-[#1c1b19] p-1 rounded-xl border border-white/5 flex items-center gap-1">
            <button
              onClick={() => setViewMode('total')}
              title={t.viewTotal}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                viewMode === 'total'
                  ? 'bg-white/15 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.viewTotal}
            </button>
            <button
              onClick={() => setViewMode('split')}
              title={t.viewSplit}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                viewMode === 'split'
                  ? 'bg-white/15 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {language === 'HIN' ? 'विभाजन' : 'Split'}
            </button>
          </div>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="bg-[#1a1917] rounded-2xl p-3.5 border border-white/5 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">{t.avgPerMonth}</span>
          <p className="text-white text-base sm:text-lg font-black tracking-tight mt-1">₹{stats.avgMonthly.toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1917] rounded-2xl p-3.5 border border-white/5 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">{t.vsLastMonth}</span>
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-base sm:text-lg font-black tracking-tight ${
              stats.deltaPercent <= 0 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {stats.deltaPercent > 0 ? `+${stats.deltaPercent}%` : `${stats.deltaPercent}%`}
            </span>
            <span className="text-xs">{stats.deltaPercent <= 0 ? '📉' : '📈'}</span>
          </div>
        </div>

        <div className="bg-[#1a1917] rounded-2xl p-3.5 border border-white/5 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">{t.impulsiveSpend}</span>
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-base sm:text-lg font-black tracking-tight ${
              stats.impulseRatio > 30 ? 'text-red-400' : 'text-slate-200'
            }`}>
              {stats.impulseRatio}%
            </span>
            <span className="text-[10px] text-slate-500 font-bold">of total</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 pt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 12, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Gold Gradient */}
              <linearGradient id="totalSpendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D0BB95" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#D0BB95" stopOpacity={0.0} />
              </linearGradient>
              {/* Emerald Gradient */}
              <linearGradient id="wiseSpendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              {/* Gold / Considerable Gradient */}
              <linearGradient id="considerableSpendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D0BB95" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#D0BB95" stopOpacity={0.0} />
              </linearGradient>
              {/* Rose Gradient */}
              <linearGradient id="impulsiveSpendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff5252" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ff5252" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

            <XAxis 
              dataKey="shortLabel" 
              tickLine={false} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
              dy={6}
            />

            <YAxis 
              domain={[0, maxSpend]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#71717a', fontSize: 9, fontWeight: 600 }}
              tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(208, 187, 149, 0.25)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

            {/* Allowance Reference Line */}
            {monthlyAllowance > 0 && (
              <ReferenceLine 
                y={monthlyAllowance} 
                stroke="rgba(208, 187, 149, 0.4)" 
                strokeDasharray="4 4"
                label={{ 
                  value: `${t.allowanceLimit} ₹${(monthlyAllowance/1000).toFixed(0)}k`, 
                  fill: '#D0BB95', 
                  fontSize: 9, 
                  position: 'insideTopRight',
                  fontWeight: 700 
                }} 
              />
            )}

            {viewMode === 'total' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="none"
                  fill="url(#totalSpendGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name={t.totalSpend}
                  stroke="#D0BB95"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#121110', stroke: '#D0BB95', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#D0BB95', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </>
            ) : (
              <>
                <Area
                  type="monotone"
                  dataKey="wise"
                  stroke="none"
                  fill="url(#wiseSpendGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="wise"
                  name={t.wiseSpend}
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#121110', stroke: '#10b981', strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="considerable"
                  stroke="none"
                  fill="url(#considerableSpendGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="considerable"
                  name={t.considerableSpend}
                  stroke="#D0BB95"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#121110', stroke: '#D0BB95', strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: '#D0BB95', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="impulsive"
                  stroke="none"
                  fill="url(#impulsiveSpendGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="impulsive"
                  name={t.impulsiveSpend}
                  stroke="#ff5252"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#121110', stroke: '#ff5252', strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: '#ff5252', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend & Quick Info */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
        <div className="flex items-center gap-4">
          {viewMode === 'total' ? (
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary"></span>
              <span className="text-slate-400 font-bold uppercase tracking-wider">{t.totalSpend}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-wise"></span>
                <span className="text-slate-400 font-bold uppercase tracking-wider">{t.wiseSpend}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#D0BB95]"></span>
                <span className="text-slate-400 font-bold uppercase tracking-wider">{t.considerableSpend}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-impulsive"></span>
                <span className="text-slate-400 font-bold uppercase tracking-wider">{t.impulsiveSpend}</span>
              </div>
            </>
          )}

          {monthlyAllowance > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-[1px] bg-primary border-t border-dashed border-primary"></span>
              <span className="text-slate-500 font-bold uppercase tracking-wider">{t.allowanceLimit}</span>
            </div>
          )}
        </div>

        {onNavigateToAnalytics && (
          <button
            onClick={onNavigateToAnalytics}
            className="text-primary hover:text-white font-black uppercase tracking-widest flex items-center gap-1 transition-colors"
          >
            <span>{t.viewFullStats}</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default SpendingTrendsChart;
