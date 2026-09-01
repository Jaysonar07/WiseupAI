import { Transaction, Goal } from '../types';

/**
 * Generates sample transactions anchored to the user's specific requested list:
 *
 * Current Month / Active:
 * - McDonald's: ₹2500 (Impulsive)
 * - Books: ₹1600 (Considerable)
 * - Shoes: ₹999 (Considerable)
 * - Bus Monthly Pass: ₹750 (Wise)
 * - Naturals Ice Cream: ₹350 (Impulsive)
 *
 * August 2026:
 * - 5 August: Burger King (₹499) - Impulsive
 * - 7 August: Movie (₹299) - Impulsive
 * - 12 August: Rikshaw (₹149) - Wise
 * - 20 August: Stationary (₹60) - Wise
 * - 22 August: Clothes (₹3500) - Impulsive
 * - 26 August: Keyboard (₹2999) - Considerable
 * - 29 August: Posters (₹350) - Impulsive
 */
export function getSampleTransactions(baseDate = new Date()): Transaction[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const getDateInMonth = (monthOffset: number, day: number, hour = 14, min = 30): string => {
    const d = new Date(year, month + monthOffset, day, hour, min, 0);
    return d.toISOString();
  };

  const getSpecificDate = (targetYear: number, targetMonth0: number, day: number, hour = 14, min = 30): string => {
    const d = new Date(targetYear, targetMonth0, day, hour, min, 0);
    return d.toISOString();
  };

  const sampleList: Transaction[] = [
    // ==========================================
    // CURRENT MONTH (Active Dataset)
    // ==========================================
    {
      id: 'tx-curr-1',
      merchant: "McDonald's",
      amount: 2500,
      category: 'Food & Drinks',
      type: 'Impulsive',
      date: getDateInMonth(0, 1, 20, 30),
      icon: 'fastfood',
      source: 'scan',
      entryMethod: 'scanned_bill'
    },
    {
      id: 'tx-curr-2',
      merchant: 'Books',
      amount: 1600,
      category: 'Education',
      type: 'Considerable',
      date: getDateInMonth(0, 1, 15, 0),
      icon: 'menu_book',
      source: 'manual',
      entryMethod: 'manual_entry'
    },
    {
      id: 'tx-curr-3',
      merchant: 'Shoes',
      amount: 999,
      category: 'Shopping',
      type: 'Considerable',
      date: getDateInMonth(0, 1, 12, 15),
      icon: 'shopping_bag',
      source: 'scan',
      entryMethod: 'scanned_bill'
    },
    {
      id: 'tx-curr-4',
      merchant: 'Bus Monthly Pass',
      amount: 750,
      category: 'Transit',
      type: 'Wise',
      date: getDateInMonth(0, 1, 8, 30),
      icon: 'directions_bus',
      source: 'manual',
      entryMethod: 'manual_entry'
    },
    {
      id: 'tx-curr-5',
      merchant: 'Naturals Ice Cream',
      amount: 350,
      category: 'Food & Drinks',
      type: 'Impulsive',
      date: getDateInMonth(0, 1, 18, 45),
      icon: 'icecream',
      source: 'scan',
      entryMethod: 'scanned_bill'
    },

    // ==========================================
    // AUGUST 2026 (Requested Specific Dates & Transactions)
    // ==========================================
    {
      id: 'tx-aug-5',
      merchant: 'Burger King',
      amount: 499,
      category: 'Food & Drinks',
      type: 'Impulsive',
      date: getSpecificDate(2026, 7, 5, 13, 15), // 5 August (Month 7 in 0-indexed JS)
      icon: 'lunch_dining',
      source: 'scan',
      entryMethod: 'scanned_bill'
    },
    {
      id: 'tx-aug-7',
      merchant: 'Movie',
      amount: 299,
      category: 'Entertainment',
      type: 'Impulsive',
      date: getSpecificDate(2026, 7, 7, 19, 45), // 7 August
      icon: 'movie',
      source: 'manual',
      entryMethod: 'manual_entry'
    },
    {
      id: 'tx-aug-12',
      merchant: 'Rikshaw',
      amount: 149,
      category: 'Transit',
      type: 'Wise',
      date: getSpecificDate(2026, 7, 12, 10, 30), // 12 August
      icon: 'local_taxi',
      source: 'manual',
      entryMethod: 'manual_entry'
    },
    {
      id: 'tx-aug-20',
      merchant: 'Stationary',
      amount: 60,
      category: 'Education',
      type: 'Wise',
      date: getSpecificDate(2026, 7, 20, 16, 20), // 20 August
      icon: 'edit_note',
      source: 'scan',
      entryMethod: 'scanned_bill'
    },
    {
      id: 'tx-aug-22',
      merchant: 'Clothes',
      amount: 3500,
      category: 'Shopping',
      type: 'Impulsive',
      date: getSpecificDate(2026, 7, 22, 17, 50), // 22 August
      icon: 'checkroom',
      source: 'scan',
      entryMethod: 'scanned_bill'
    },
    {
      id: 'tx-aug-26',
      merchant: 'Keyboard',
      amount: 2999,
      category: 'Work & Tech',
      type: 'Considerable',
      date: getSpecificDate(2026, 7, 26, 12, 10), // 26 August
      icon: 'keyboard',
      source: 'scan',
      entryMethod: 'scanned_bill'
    },
    {
      id: 'tx-aug-29',
      merchant: 'Posters',
      amount: 350,
      category: 'Decor',
      type: 'Impulsive',
      date: getSpecificDate(2026, 7, 29, 18, 30), // 29 August
      icon: 'palette',
      source: 'manual',
      entryMethod: 'manual_entry'
    },

    // ==========================================
    // JULY 2026 (Trend Comparisons)
    // ==========================================
    {
      id: 'tx-jul-1',
      merchant: 'Bus Monthly Pass',
      amount: 750,
      category: 'Transit',
      type: 'Wise',
      date: getSpecificDate(2026, 6, 2, 8, 45), // July
      icon: 'directions_bus',
      source: 'manual',
      entryMethod: 'manual_entry'
    },
    {
      id: 'tx-jul-2',
      merchant: 'Technical Programming Books',
      amount: 1800,
      category: 'Education',
      type: 'Considerable',
      date: getSpecificDate(2026, 6, 14, 14, 20),
      icon: 'menu_book',
      source: 'manual',
      entryMethod: 'manual_entry'
    },
    {
      id: 'tx-jul-3',
      merchant: 'Casual Canvas Shoes',
      amount: 899,
      category: 'Shopping',
      type: 'Considerable',
      date: getSpecificDate(2026, 6, 20, 17, 0),
      icon: 'shopping_bag',
      source: 'scan',
      entryMethod: 'scanned_bill'
    },
    {
      id: 'tx-jul-4',
      merchant: "McDonald's Dine-in",
      amount: 1950,
      category: 'Food & Drinks',
      type: 'Impulsive',
      date: getSpecificDate(2026, 6, 25, 21, 30),
      icon: 'fastfood',
      source: 'scan',
      entryMethod: 'scanned_bill'
    },
    {
      id: 'tx-jul-5',
      merchant: 'Naturals Ice Cream Scoops',
      amount: 280,
      category: 'Food & Drinks',
      type: 'Impulsive',
      date: getSpecificDate(2026, 6, 9, 19, 0),
      icon: 'icecream',
      source: 'scan',
      entryMethod: 'scanned_bill'
    }
  ];

  return sampleList;
}

export function getSampleGoals(): Goal[] {
  return [
    {
      id: 'goal-1',
      name: 'Trip to Goa',
      targetAmount: 20000,
      savedAmount: 11500,
      targetDate: '2026-11-30',
      icon: 'flight'
    },
    {
      id: 'goal-2',
      name: 'New Laptop Fund',
      targetAmount: 60000,
      savedAmount: 28000,
      targetDate: '2027-02-28',
      icon: 'laptop_mac'
    }
  ];
}
