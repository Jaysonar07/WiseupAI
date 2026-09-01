
export type Language = 'ENG' | 'HIN';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  type: 'Wise' | 'Impulsive' | 'Considerable';
  date: string;
  icon: string;
  imageUrl?: string;
  source?: 'scan' | 'manual';
  entryMethod?: 'scanned_bill' | 'manual_entry';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AppState {
  user: {
    name: string;
    avatar: string;
  };
  language: Language;
  isDarkMode: boolean;
  monthlyAllowance: number;
  transactions: Transaction[];
  goals: Goal[];
  currentScreen: 'welcome' | 'setup' | 'dashboard' | 'analytics' | 'tools' | 'chat' | 'offers' | 'scan' | 'settings' | 'manual_entry';
}
