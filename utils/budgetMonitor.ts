import { Transaction, Language } from '../types';

export type BudgetThresholdLevel = 'normal' | 'warning' | 'critical' | 'exceeded';

export interface BudgetAlertInfo {
  level: BudgetThresholdLevel;
  percentage: number;
  totalSpent: number;
  monthlyAllowance: number;
  remaining: number;
  isOverBudget: boolean;
  thresholdPassed?: 80 | 90 | 100;
  currentMonthName: string;
}

export interface BudgetToastData {
  id: string;
  threshold: 80 | 90 | 100;
  level: BudgetThresholdLevel;
  title: string;
  message: string;
  spent: number;
  allowance: number;
  remaining: number;
  percentage: number;
  timestamp: number;
}

/**
 * Calculates current month's spending and returns detailed budget threshold metrics
 */
export function calculateBudgetStatus(
  transactions: Transaction[], 
  monthlyAllowance: number,
  language: Language = 'ENG',
  targetDate: Date = new Date()
): BudgetAlertInfo {
  const currentMonth = targetDate.getMonth();
  const currentYear = targetDate.getFullYear();

  // Filter transactions for current month
  const currentMonthTxs = transactions.filter(tx => {
    if (!tx.date) return false;
    const d = new Date(tx.date);
    return !isNaN(d.getTime()) && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Calculate sum of transactions in this month
  // If no transactions in current month, fallback to recent transactions if list is non-empty
  let totalSpent = currentMonthTxs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  
  // If no transactions in the current calendar month yet, take all transactions as active demo
  if (totalSpent === 0 && transactions.length > 0 && currentMonthTxs.length === 0) {
    totalSpent = transactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  }

  const allowance = Number(monthlyAllowance) || 0;
  const percentage = allowance > 0 ? Math.round((totalSpent / allowance) * 100) : 0;
  const remaining = Math.max(0, allowance - totalSpent);
  const isOverBudget = allowance > 0 && totalSpent > allowance;

  let level: BudgetThresholdLevel = 'normal';
  let thresholdPassed: 80 | 90 | 100 | undefined = undefined;

  if (allowance > 0) {
    if (percentage >= 100) {
      level = 'exceeded';
      thresholdPassed = 100;
    } else if (percentage >= 90) {
      level = 'critical';
      thresholdPassed = 90;
    } else if (percentage >= 80) {
      level = 'warning';
      thresholdPassed = 80;
    }
  }

  const currentMonthName = targetDate.toLocaleString(
    language === 'HIN' ? 'hi-IN' : 'en-US', 
    { month: 'long' }
  );

  return {
    level,
    percentage,
    totalSpent,
    monthlyAllowance: allowance,
    remaining,
    isOverBudget,
    thresholdPassed,
    currentMonthName
  };
}

export function getAlertCopy(info: BudgetAlertInfo, language: Language) {
  const isHin = language === 'HIN';

  if (info.level === 'exceeded') {
    return {
      badge: isHin ? '⚠️ बजट सीमा पार' : '⚠️ 100% LIMIT EXCEEDED',
      title: isHin 
        ? `मासिक भत्ता समाप्त (${info.percentage}%)` 
        : `Monthly Allowance Exceeded (${info.percentage}%)`,
      desc: isHin
        ? `आपने ₹${info.monthlyAllowance.toLocaleString()} के भत्ते में से ₹${info.totalSpent.toLocaleString()} खर्च कर दिए हैं (₹${(info.totalSpent - info.monthlyAllowance).toLocaleString()} अधिक)।`
        : `You have spent ₹${info.totalSpent.toLocaleString()} of your ₹${info.monthlyAllowance.toLocaleString()} allowance (₹${(info.totalSpent - info.monthlyAllowance).toLocaleString()} over budget).`,
      guruAdvice: isHin
        ? "गुरु का कहना: भाई ब्रेक लगाओ! गैर-जरूरी खर्च तुरंत रोकें।"
        : "Guru says: Emergency brake time! Freeze all impulsive purchases immediately.",
      chatPrompt: "Guru, I have exceeded 100% of my monthly allowance. Give me an emergency recovery plan in witty Hinglish!",
      btnText: isHin ? 'आपातकालीन सलाह लें' : 'Get Emergency Plan'
    };
  }

  if (info.level === 'critical') {
    return {
      badge: isHin ? '🚨 90% गंभीर चेतावनी' : '🚨 90% CRITICAL ALERT',
      title: isHin 
        ? `बजट का 90% पार (${info.percentage}%)` 
        : `90% Budget Threshold Crossed (${info.percentage}%)`,
      desc: isHin
        ? `आपके मासिक भत्ते में से केवल ₹${info.remaining.toLocaleString()} शेष हैं (₹${info.totalSpent.toLocaleString()} / ₹${info.monthlyAllowance.toLocaleString()})।`
        : `Only ₹${info.remaining.toLocaleString()} remaining from your ₹${info.monthlyAllowance.toLocaleString()} allowance (₹${info.totalSpent.toLocaleString()} spent).`,
      guruAdvice: isHin
        ? "गुरु का कहना: खतरे की घंटी! सिर्फ अति-आवश्यक चीजें ही खरीदें।"
        : "Guru says: Red zone entered! Stick strictly to essentials until month-end.",
      chatPrompt: "Guru, I have used over 90% of my monthly allowance. What spending cuts should I make right now? Answer in Hinglish.",
      btnText: isHin ? 'कटौती योजना पूछें' : 'Cut-Back Advice'
    };
  }

  if (info.level === 'warning') {
    return {
      badge: isHin ? '⚡ 80% बजट चेतावनी' : '⚡ 80% BUDGET ALERT',
      title: isHin 
        ? `बजट का 80% खर्च हुआ (${info.percentage}%)` 
        : `80% Budget Threshold Reached (${info.percentage}%)`,
      desc: isHin
        ? `आपने ₹${info.totalSpent.toLocaleString()} खर्च कर लिए हैं। इस माह के लिए ₹${info.remaining.toLocaleString()} शेष हैं।`
        : `You've used ₹${info.totalSpent.toLocaleString()} of your ₹${info.monthlyAllowance.toLocaleString()} allowance. ₹${info.remaining.toLocaleString()} remaining.`,
      guruAdvice: isHin
        ? "गुरु का कहना: संभलकर! 20% से कम बफर बचा है।"
        : "Guru says: Caution ahead! Less than 20% budget buffer remaining.",
      chatPrompt: "Guru, I reached 80% of my monthly budget. How can I manage the rest of the month smoothly? Give tips in Hinglish.",
      btnText: isHin ? 'गुरु से सलाह लें' : 'Ask Guru Strategy'
    };
  }

  return {
    badge: isHin ? '✓ बजट नियंत्रण में' : '✓ BUDGET ON TRACK',
    title: isHin 
      ? `बजट सुरक्षित स्थिति (${info.percentage}%)` 
      : `Budget On Track (${info.percentage}%)`,
    desc: isHin
      ? `₹${info.monthlyAllowance.toLocaleString()} में से ₹${info.remaining.toLocaleString()} अभी भी शेष हैं।`
      : `₹${info.remaining.toLocaleString()} remaining of ₹${info.monthlyAllowance.toLocaleString()} allowance.`,
    guruAdvice: isHin
      ? "गुरु का कहना: बढ़िया जा रहे हो! यही अनुशासन बनाए रखो।"
      : "Guru says: Great pacing! Keep your momentum going.",
    chatPrompt: "Guru, my budget is well on track. Give me a tip to save even more this month!",
    btnText: isHin ? 'सुझाव देखें' : 'View Tips'
  };
}
