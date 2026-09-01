
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import SetupScreen from './screens/SetupScreen';
import DashboardScreen from './screens/DashboardScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import ToolsScreen from './screens/ToolsScreen';
import ChatScreen from './screens/ChatScreen';
import OffersScreen from './screens/OffersScreen';
import SettingsScreen from './screens/SettingsScreen';
import ScanScreen from './screens/ScanScreen';
import ScanResultScreen from './screens/ScanResultScreen';
import ManualEntryScreen from './screens/ManualEntryScreen';
import Navigation from './components/Navigation';
import BudgetToast from './components/BudgetToast';
import { AppState, Goal, Transaction } from './types';
import { onAuthStateChanged, signOut, loadUserData, saveUserData } from './services/firebase';
import { calculateBudgetStatus, BudgetToastData, BudgetAlertInfo } from './utils/budgetMonitor';
import { getSampleTransactions, getSampleGoals } from './utils/mockData';

const INITIAL_GOALS: Goal[] = getSampleGoals();
const INITIAL_TRANSACTIONS: Transaction[] = getSampleTransactions();
const DEFAULT_AVATAR = '/default-avatar.png'; // Default Pizza Profile Image

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: { 
      name: 'Guest', 
      avatar: DEFAULT_AVATAR 
    },
    language: 'ENG',
    isDarkMode: true,
    monthlyAllowance: 15000,
    transactions: INITIAL_TRANSACTIONS,
    goals: INITIAL_GOALS,
    currentScreen: 'welcome'
  });

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [pendingChatQuery, setPendingChatQuery] = useState<string | null>(null);
  const [toastAlert, setToastAlert] = useState<BudgetToastData | null>(null);

  // Sync theme with document element
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  const triggerToastForStatus = (info: BudgetAlertInfo, forceThreshold?: 80 | 90 | 100) => {
    if (info.monthlyAllowance <= 0) return;
    const threshold = forceThreshold || info.thresholdPassed;
    if (!threshold) return;

    const isHin = state.language === 'HIN';
    let title = '';
    let message = '';

    if (threshold === 100 || info.level === 'exceeded') {
      title = isHin ? '100% मासिक भत्ता सीमा पार!' : '100% Allowance Limit Exceeded!';
      message = isHin
        ? `आपने ₹${info.totalSpent.toLocaleString()} खर्च कर दिए हैं (₹${(info.totalSpent - info.monthlyAllowance).toLocaleString()} अधिक)।`
        : `You have consumed ₹${info.totalSpent.toLocaleString()} of your ₹${info.monthlyAllowance.toLocaleString()} allowance.`;
    } else if (threshold === 90 || info.level === 'critical') {
      title = isHin ? '90% गंभीर बजट चेतावनी!' : '90% Critical Budget Alert!';
      message = isHin
        ? `आपके पास केवल ₹${info.remaining.toLocaleString()} बचे हैं। गैर-ज़रूरी खर्च तुरंत रोकें!`
        : `Only ₹${info.remaining.toLocaleString()} remaining for this month. Critical red zone active.`;
    } else {
      title = isHin ? '80% बजट सीमा चेतावनी!' : '80% Budget Threshold Reached!';
      message = isHin
        ? `आपने ₹${info.monthlyAllowance.toLocaleString()} में से ₹${info.totalSpent.toLocaleString()} खर्च कर लिए हैं (₹${info.remaining.toLocaleString()} शेष)।`
        : `You've used ${info.percentage}% of your monthly allowance (₹${info.remaining.toLocaleString()} remaining).`;
    }

    setToastAlert({
      id: String(Date.now()),
      threshold,
      level: info.level,
      title,
      message,
      spent: info.totalSpent,
      allowance: info.monthlyAllowance,
      remaining: info.remaining,
      percentage: info.percentage,
      timestamp: Date.now()
    });
  };

  // Auth Listener
  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (!isMounted) return;
      
      if (user) {
        setUserId(user.uid);
        const userData = await loadUserData(user.uid);
        
        if (userData) {
          const allowance = userData.monthlyAllowance || 0;
          const txs = userData.transactions || [];
          setState(prev => ({
            ...prev,
            user: {
              name: user.displayName || userData.user?.name || 'User',
              avatar: user.photoURL || userData.user?.avatar || DEFAULT_AVATAR
            },
            monthlyAllowance: allowance,
            transactions: txs,
            goals: userData.goals || [],
            currentScreen: (allowance > 0) ? 'dashboard' : 'setup'
          }));

          // Trigger initial check if user is already past threshold
          if (allowance > 0 && txs.length > 0) {
            const status = calculateBudgetStatus(txs, allowance, state.language);
            if (status.thresholdPassed) {
              setTimeout(() => {
                triggerToastForStatus(status, status.thresholdPassed);
              }, 1200);
            }
          }
        } else {
          // New user, verified login but no data yet
          setState(prev => ({
            ...prev,
            user: {
              name: user.displayName || 'User',
              avatar: user.photoURL || DEFAULT_AVATAR
            },
            currentScreen: 'setup'
          }));
        }
      } else {
        setUserId(null);
        setState(prev => ({ 
          ...prev, 
          currentScreen: 'welcome', 
          monthlyAllowance: 0, 
          transactions: [], 
          goals: [] 
        }));
      }
      setLoading(false);
    });

    return () => { isMounted = false; unsubscribe(); };
  }, []);

  const persistData = async (updates: Partial<AppState>) => {
    if (!userId) return;
    await saveUserData(userId, updates);
  };

  const updateScreen = (screen: AppState['currentScreen']) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  };

  const handleDashboardAction = (screen: AppState['currentScreen'], query?: string) => {
    if (query) setPendingChatQuery(query);
    updateScreen(screen);
  };

  const handleAddTransaction = (tx: Transaction) => {
    const beforeStatus = calculateBudgetStatus(state.transactions, state.monthlyAllowance, state.language);
    const updatedTxs = [tx, ...state.transactions];
    const afterStatus = calculateBudgetStatus(updatedTxs, state.monthlyAllowance, state.language);

    setState(prev => ({ ...prev, transactions: updatedTxs }));
    persistData({ transactions: updatedTxs });

    // Threshold monitoring check
    if (afterStatus.monthlyAllowance > 0) {
      if (beforeStatus.percentage < 80 && afterStatus.percentage >= 80 && afterStatus.percentage < 90) {
        triggerToastForStatus(afterStatus, 80);
      } else if (beforeStatus.percentage < 90 && afterStatus.percentage >= 90 && afterStatus.percentage < 100) {
        triggerToastForStatus(afterStatus, 90);
      } else if (beforeStatus.percentage < 100 && afterStatus.percentage >= 100) {
        triggerToastForStatus(afterStatus, 100);
      } else if (afterStatus.percentage >= 80) {
        triggerToastForStatus(afterStatus, afterStatus.percentage >= 90 ? 90 : 80);
      }
    }
  };

  const handleSimulateThreshold = (targetPercentage: number) => {
    const allowance = state.monthlyAllowance > 0 ? state.monthlyAllowance : 15000;
    const targetSpent = Math.round((allowance * targetPercentage) / 100);
    const currentTotal = state.transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const diff = targetSpent - currentTotal;
    
    let updatedTxs = [...state.transactions];
    if (diff > 0) {
      const testTx: Transaction = {
        id: `sim-tx-${Date.now()}`,
        merchant: targetPercentage >= 90 ? 'Weekend Luxury Dine' : 'Apparel Shopping',
        amount: diff,
        category: targetPercentage >= 90 ? 'Food & Drinks' : 'Shopping',
        type: 'Impulsive',
        date: new Date().toISOString(),
        icon: targetPercentage >= 90 ? 'restaurant' : 'shopping_bag'
      };
      updatedTxs = [testTx, ...state.transactions];
    } else if (diff < 0) {
      const ratio = targetSpent / (currentTotal || 1);
      updatedTxs = state.transactions.map(t => ({
        ...t,
        amount: Math.max(50, Math.round(t.amount * ratio))
      }));
    }

    setState(prev => ({ ...prev, monthlyAllowance: allowance, transactions: updatedTxs }));
    persistData({ monthlyAllowance: allowance, transactions: updatedTxs });

    const newStatus = calculateBudgetStatus(updatedTxs, allowance, state.language);
    triggerToastForStatus(
      newStatus, 
      targetPercentage >= 100 ? 100 : (targetPercentage >= 90 ? 90 : 80)
    );
  };

  const handleAddGoal = (goal: Goal) => {
    const updatedGoals = [...state.goals, goal];
    setState(prev => ({ ...prev, goals: updatedGoals, currentScreen: 'dashboard' }));
    persistData({ goals: updatedGoals });
  };

  const handleUpdateGoal = (goalId: string, savedAmount: number) => {
    const updatedGoals = state.goals.map(g => g.id === goalId ? { ...g, savedAmount: g.savedAmount + savedAmount } : g);
    setState(prev => ({ ...prev, goals: updatedGoals }));
    persistData({ goals: updatedGoals });
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = state.goals.filter(g => g.id !== goalId);
    setState(prev => ({ ...prev, goals: updatedGoals }));
    persistData({ goals: updatedGoals });
  };

  const setAllowance = (amount: number) => {
    setState(prev => ({ ...prev, monthlyAllowance: amount, currentScreen: 'dashboard' }));
    persistData({ monthlyAllowance: amount });
    const status = calculateBudgetStatus(state.transactions, amount, state.language);
    if (status.thresholdPassed) {
      triggerToastForStatus(status, status.thresholdPassed);
    }
  };

  const handleUpdateAllowance = (amount: number) => {
    setState(prev => ({ ...prev, monthlyAllowance: amount }));
    persistData({ monthlyAllowance: amount });
    const status = calculateBudgetStatus(state.transactions, amount, state.language);
    if (status.thresholdPassed) {
      triggerToastForStatus(status, status.thresholdPassed);
    }
  };

  const handleLogout = async () => {
    await signOut();
    updateScreen('welcome');
  };

  const handleUpdateProfile = (name: string, avatar: string) => {
    setState(prev => ({ ...prev, user: { name, avatar } }));
    persistData({ user: { name, avatar } });
  };

  const handleResetSampleData = () => {
    const sampleTxs = getSampleTransactions();
    const sampleGoals = getSampleGoals();
    const allowance = state.monthlyAllowance > 0 ? state.monthlyAllowance : 15000;
    setState(prev => ({
      ...prev,
      monthlyAllowance: allowance,
      transactions: sampleTxs,
      goals: sampleGoals
    }));
    persistData({
      monthlyAllowance: allowance,
      transactions: sampleTxs,
      goals: sampleGoals
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="relative size-20">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'welcome':
        return <WelcomeScreen language={state.language} onToggleLang={() => setState(p => ({...p, language: p.language === 'ENG' ? 'HIN' : 'ENG'}))} onContinue={() => {}} />;
      case 'setup':
        return <SetupScreen state={state} onSave={setAllowance} />;
      case 'dashboard':
        return (
          <DashboardScreen 
            state={state} 
            onAction={handleDashboardAction} 
            onUpdateGoal={handleUpdateGoal} 
            onDeleteGoal={handleDeleteGoal}
            onSimulateThreshold={handleSimulateThreshold}
            onResetSampleData={handleResetSampleData}
          />
        );
      case 'analytics':
        return <AnalyticsScreen state={state} onBack={() => updateScreen('dashboard')} onAction={handleDashboardAction} />;
      case 'tools':
        return <ToolsScreen state={state} onBack={() => updateScreen('dashboard')} onAddGoal={handleAddGoal} />;
      case 'chat':
        return <ChatScreen state={state} onBack={() => updateScreen('dashboard')} initialQuery={pendingChatQuery} onClearInitialQuery={() => setPendingChatQuery(null)} />;
      case 'offers':
        return <OffersScreen state={state} onBack={() => updateScreen('dashboard')} onNavigate={updateScreen} />;
      case 'scan':
        return <ScanResultScreen state={state} scannedImage={scannedImage} onBack={() => updateScreen('dashboard')} onAddTransaction={handleAddTransaction} />;
      case 'manual_entry':
        return <ManualEntryScreen state={state} onBack={() => updateScreen('dashboard')} onAddTransaction={handleAddTransaction} />;
      case 'settings':
        return (
          <SettingsScreen 
            state={state} 
            onBack={() => updateScreen('dashboard')} 
            onLogout={handleLogout} 
            onToggleLang={() => setState(p => ({...p, language: p.language === 'ENG' ? 'HIN' : 'ENG'}))} 
            onToggleTheme={() => setState(p => ({...p, isDarkMode: !p.isDarkMode}))}
            onUpdateProfile={handleUpdateProfile}
            onUpdateAllowance={handleUpdateAllowance}
            onOpenSetup={() => updateScreen('setup')}
            onResetSampleData={handleResetSampleData}
          />
        );
      default:
        return (
          <DashboardScreen 
            state={state} 
            onAction={handleDashboardAction} 
            onUpdateGoal={handleUpdateGoal} 
            onDeleteGoal={handleDeleteGoal}
            onSimulateThreshold={handleSimulateThreshold}
            onResetSampleData={handleResetSampleData}
          />
        );
    }
  };

  const isAuthOrSetup = state.currentScreen === 'welcome' || state.currentScreen === 'setup';

  return (
    <div className="min-h-screen w-full bg-background-light dark:bg-[#070707] text-slate-100 transition-colors duration-300 flex justify-center selection:bg-primary/30 selection:text-white">
      {/* Floating Budget Threshold Toast Notification */}
      <BudgetToast 
        toast={toastAlert} 
        onDismiss={() => setToastAlert(null)} 
        onAction={(q) => handleDashboardAction('chat', q)} 
      />

      {isAuthOrSetup ? (
        <div className="w-full min-h-screen flex flex-col justify-center items-center p-3 sm:p-6 md:p-8">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-[#0d0c0b] rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            {renderScreen()}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row gap-0 md:gap-4 lg:gap-6 p-0 md:p-4 lg:p-6 min-h-screen">
          {/* Responsive Navigation: Mobile Bottom Bar + Desktop/Tablet Sidebar */}
          <Navigation 
            currentScreen={state.currentScreen} 
            onNavigate={(screen) => {
              if (screen === 'scan') setScannedImage(null);
              updateScreen(screen);
            }} 
            user={state.user}
            language={state.language}
            onToggleLang={() => setState(p => ({ ...p, language: p.language === 'ENG' ? 'HIN' : 'ENG' }))}
          />

          {/* Main App Content Viewport */}
          <main className="flex-1 min-w-0 bg-[#0d0c0b] md:rounded-3xl border-0 md:border md:border-white/5 shadow-2xl overflow-hidden flex flex-col relative min-h-screen md:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
            {state.currentScreen === 'scan' && !scannedImage ? (
              <ScanScreen 
                onBack={() => updateScreen('dashboard')} 
                onCapture={(img) => { setScannedImage(img); updateScreen('scan'); }} 
              />
            ) : (
              renderScreen()
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;

