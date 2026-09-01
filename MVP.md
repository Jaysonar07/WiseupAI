# 🚀 WiseupAI — Minimum Viable Product (MVP) Documentation

<div align="center">
  <h2>Smart Bilingual Financial Companion & AI Spending Coach for Students and Young Adults</h2>
  <p><strong>Powered by Google Gemini 3 Flash • React 19 • Vite • Recharts • Motion</strong></p>
</div>

---

## 📑 Table of Contents
1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [Target Audience & Problem Statement](#2-target-audience--problem-statement)
3. [System Architecture & Tech Stack](#3-system-architecture--tech-stack)
4. [Core Features & Functional Modules](#4-core-features--functional-modules)
   - [4.1 Interactive Onboarding & User Setup](#41-interactive-onboarding--user-setup)
   - [4.2 Real-Time Financial Dashboard & Budget Pacing](#42-real-time-financial-dashboard--budget-pacing)
   - [4.3 Multimodal AI Receipt Scanner](#43-multimodal-ai-receipt-scanner)
   - [4.4 Smart Manual Expense Logger with Instant AI Categorization](#44-smart-manual-expense-logger-with-instant-ai-categorization)
   - [4.5 Unified Financial Intelligence Hub (3-in-1 Analytics)](#45-unified-financial-intelligence-hub-3-in-1-analytics)
   - [4.6 AI Financial Guru (Context-Aware Hinglish/English Coach)](#46-ai-financial-guru-context-aware-hinglishenglish-coach)
   - [4.7 Intelligent Budget Threshold & Proactive Alert Engine](#47-intelligent-budget-threshold--proactive-alert-engine)
   - [4.8 Financial Planning Tools (Goal Planner & SIP Calculator)](#48-financial-planning-tools-goal-planner--sip-calculator)
   - [4.9 Verified Student Perks & Deals Hub](#49-verified-student-perks--deals-hub)
   - [4.10 Settings, Customization & CSV Data Export](#410-settings-customization--csv-data-export)
5. [Data Models & Type Definitions](#5-data-models--type-definitions)
6. [AI Engine & Prompt Engineering Architecture](#6-ai-engine--prompt-engineering-architecture)
7. [Design System & UI/UX Aesthetics](#7-design-system--uiux-aesthetics)
8. [Installation & Setup Guide](#8-installation--setup-guide)
9. [Verification & Build Health](#9-verification--build-health)
10. [Post-MVP Roadmap & Future Enhancements](#10-post-mvp-roadmap--future-enhancements)

---

## 1. Executive Summary & Product Vision

**WiseupAI** is a next-generation personal finance and expense-intelligence web application tailored for college students, young professionals, and early-career earners. Combining multimodal artificial intelligence with behavioral finance, WiseupAI transforms tedious budgeting into an engaging, insightful, and culturally relatable experience.

At the core of the platform is the **AI Financial Guru**, powered by **Google Gemini 3 Flash**. The Guru acts not as a rigid calculator, but as a witty, street-smart financial mentor speaking fluent **Hinglish** (and structured English) that roasts impulsive spending, praises financial discipline, extracts receipts visually in seconds, and provides actionable step-by-step recovery plans when budgets are strained.

---

## 2. Target Audience & Problem Statement

### 🎯 Target Audience
- **College & University Students** managing monthly allowances, pocket money, or part-time earnings.
- **Young Working Professionals / Gen Z** navigating initial salaries, peer dining, subscriptions, and shopping impulses.
- **Bilingual Users in India** who prefer culturally contextual guidance in Hindi/Hinglish rather than generic Western budgeting advice.

### ⚠️ The Problem
1. **Friction in Expense Tracking:** Manual data entry leads to abandoned budgeting apps within 7 days.
2. **Lack of Impulsive vs. Wise Distinction:** Traditional apps only record numbers without judging whether an expense was a genuine need, a thoughtful purchase, or an emotional impulse.
3. **Boring & Dry Feedback:** Standard graphs lack personality and do not inspire behavioral change.
4. **Sudden Month-End Cash Crises:** Students deplete 80-90% of their monthly pocket money within the first 10-15 days without early-warning pacing systems.

### 💡 The WiseupAI Solution
- **Zero-Effort Bill Scanning:** Instant receipt extraction and classification via camera or upload.
- **Smart Tri-Tier Classification:** Every transaction is categorized as **Wise** (Needs), **Considerable** (Thoughtful), or **Impulsive** (Wants).
- **Proactive Budget Monitoring:** Dynamic threshold triggers at 80%, 90%, and 100% of allowance with emergency recovery strategies.
- **Engaging AI Persona:** Guru Roasts, Shabaashi (praise), and bespoke recovery roadmaps that keep users coming back.

---

## 3. System Architecture & Tech Stack

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │                     CLIENT APPLICATION                 │
                                  │                  (React 19 + TypeScript + Vite)        │
                                  └──────────┬─────────────────────────────────┬───────────┘
                                             │                                 │
                     ┌───────────────────────▼───────┐             ┌───────────▼─────────────────────┐
                     │          UI / UX LAYER        │             │        STATE & UTILITY ENGINE   │
                     ├───────────────────────────────┤             ├─────────────────────────────────┤
                     │ • Tailwind CSS & Custom Themes│             │ • AppState Management (Local)   │
                     │ • Motion (Framer Motion v12)  │             │ • BudgetMonitor Threshold Engine│
                     │ • Recharts (Visualizations)   │             │ • CSV Export Engine             │
                     │ • Lucide & Material Icons     │             │ • Bilingual Localization (EN/HI)│
                     └───────────────┬───────────────┘             └───────────┬─────────────────────┘
                                     │                                         │
                                     └───────────────────┬─────────────────────┘
                                                         │
                                    ┌────────────────────▼───────────────────┐
                                    │             SERVICES LAYER             │
                                    ├────────────────────────────────────────┤
                                    │ • geminiService.ts (Google GenAI SDK)  │
                                    │ • firebase.ts (Auth & Firestore Sync)  │
                                    └──────────────┬──────────────────┬──────┘
                                                   │                  │
                         ┌─────────────────────────▼───┐          ┌───▼──────────────────────────┐
                         │      GOOGLE GEMINI API      │          │       FIREBASE BACKEND       │
                         │    (gemini-3-flash-preview) │          │  (Authentication & Database) │
                         ├─────────────────────────────┤          ├──────────────────────────────┤
                         │ • Multimodal Receipt OCR    │          │ • Google Sign-In & Mock Auth │
                         │ • Expense Categorization    │          │ • User Profiles & Sync       │
                         │ • Hinglish AI Guru Chat     │          │ • Firestore Cloud Storage    │
                         └─────────────────────────────┘          └──────────────────────────────┘
```

### 🛠️ Technology Stack Detail

| Layer | Technology | Version / Purpose |
| :--- | :--- | :--- |
| **Runtime & Bundler** | [Vite](https://vitejs.dev/) | `^6.2.0` — Ultra-fast HMR and ESM build pipeline |
| **Frontend Framework** | [React](https://react.dev/) | `^19.2.3` — Latest component architecture & hooks |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~5.8.2` — Strict typing across schemas & interfaces |
| **AI SDK** | [@google/genai](https://www.npmjs.com/package/@google/genai) | `^1.35.0` — Direct multimodal integration with Gemini models |
| **AI Model** | `gemini-3-flash-preview` | Low-latency multimodal reasoning and structured JSON output |
| **Animations** | [Motion](https://motion.dev/) | `^12.38.0` — Smooth gestures, page transitions, and toast anims |
| **Data Visualization**| [Recharts](https://recharts.org/) | `^3.10.1` — Interactive Pie, Area, and Bar charts |
| **Icons** | [Lucide React](https://lucide.dev/) & Google Material Symbols | High-clarity iconography for financial metaphors |
| **Authentication & Cloud** | Firebase Web SDK | v12.7.0 (Google Auth, Firestore DB, with fallback mock engine) |

---

## 4. Core Features & Functional Modules

### 4.1 Interactive Onboarding & User Setup
- **Welcome Screen (`WelcomeScreen.tsx`):** Engaging landing flow introducing the Guru persona, language switch (English / हिन्दी), and instant Google or guest login.
- **Setup Flow (`SetupScreen.tsx`):**
  - Customizes student profile (Name & Avatar selection).
  - Captures **Monthly Allowance / Pocket Money** (₹).
  - Creates the primary financial dream/saving goal (e.g., Laptop, Travel, Phone).

### 4.2 Real-Time Financial Dashboard & Budget Pacing
- **Live Net Spend Overview:** Breakdown of total spend, wise expenses (needs), and impulsive expenditures.
- **Budget Health Widget (`BudgetOverviewWidget.tsx`):**
  - Circular progress ring indicating consumed allowance percentage.
  - Days remaining in current billing cycle with daily safe-spending limit.
  - Visual status chips: `ON TRACK`, `WARNING (80%)`, `CRITICAL (90%)`, or `EXCEEDED (100%)`.
- **Guru Quick Action Cards:**
  - **"Roast My Spending"**: Automatically prompts Gemini with user transaction history for a witty Hinglish reality check.
  - **"Guru Praise"**: Acknowledges financial discipline when impulsive spending is minimized.
  - **"Starter Advice"**: Onboarding guidance for fresh accounts.
- **Interactive Goal Cards:** Direct quick-deposit to increment saved amounts with celebration animations.

### 4.3 Multimodal AI Receipt Scanner (`ScanScreen.tsx` & `ScanResultScreen.tsx`)
- **Direct Camera & Photo Upload:** Real-time capture or image upload of receipts, bills, or payment screenshots.
- **Multimodal Gemini Vision OCR:**
  - Extracts **Merchant Name**, **Total Amount (₹)**, **Transaction Date**, and **Category**.
  - Analyzes itemized contents to classify type: `Wise`, `Considerable`, or `Impulsive`.
  - Generates instant **AI Insight** explaining why the expense was categorized that way.
- **Editable Verification Screen:** Allows users to review, adjust amounts or categories, and save to their ledger with one tap.

### 4.4 Smart Manual Expense Logger (`ManualEntryScreen.tsx`)
- High-speed offline-first manual transaction logging.
- AI Autoclassification: Entering merchant + amount automatically calls Gemini to determine category and psychological spending bucket (`Wise` vs `Impulsive`).
- Custom note and manual override options.

### 4.5 Unified Financial Intelligence Hub (3-in-1 Analytics)
Integrated within `MergedAnalyticsHub.tsx` and `AnalyticsScreen.tsx`, featuring a swipeable carousel:

1. **Slide 1: Expense Logging Source Breakdown (`ExpenseSourcePieChart.tsx`)**
   - Segregates spending logged via **Scanned Bills / Invoices** vs. **Manual Quick Entries**.
   - Donut chart with spend counts, percentage distribution, and automated tracking efficiency rating.
2. **Slide 2: Monthly Spending Trends & Projection (`SpendingTrendsChart.tsx`)**
   - Area chart tracking cumulative expenditure across days 1–31.
   - Comparative linear budget limit trajectory and safe-spending corridors.
   - Projected end-of-month spend based on current burn rate.
3. **Slide 3: Spending Intensity Calendar & Heatmap**
   - 31-day visual calendar grid color-coded by daily expenditure intensity (Low, Medium, High, Extreme).
   - Impulsive trigger day markers (`🔥`) and Clean Streak indicators (`🛡️`).
   - Identifies peak spending days (e.g., weekends vs. weekdays).

### 4.6 AI Financial Guru (Context-Aware Hinglish/English Coach)
- **Dedicated Chat Assistant (`ChatScreen.tsx`):**
  - Conversational interface with context injection of all transactions, active goals, and monthly allowance.
  - Bilingual fluency: default witty Hinglish persona with ability to switch to formal English upon request.
  - Suggested contextual quick-prompts: *"How do I save ₹5000 this month?"*, *"Am I spending too much on Swiggy?"*, *"Emergency recovery plan"*.

### 4.7 Intelligent Budget Threshold & Proactive Alert Engine (`budgetMonitor.ts` & `BudgetAlertBanner.tsx`)
- Monitors spend against allowance across 4 distinct thresholds:
  - **Normal (< 80%):** Green status, encouraging pacing guidance.
  - **Warning (80% - 89%):** Amber warning banner, notification toasts, prompting buffer preservation.
  - **Critical (90% - 99%):** Red alert banner, strict cut-back advice, freeze on non-essentials.
  - **Exceeded (≥ 100%):** High-priority emergency banner with one-click direct prompt to Gemini for an emergency recovery plan.
- **Interactive Threshold Simulator:** Allows users and judges to simulate 80%, 90%, and 100% states in real-time.

### 4.8 Financial Planning Tools (`ToolsScreen.tsx`)
- **Goal Setter:** Computes required monthly savings for custom items with target dates.
- **SIP Compound Growth Calculator:**
  - Interactive sliders for monthly investment (₹0 - ₹50,000), expected return rate (1% - 30%), and tenure (1 - 30 years).
  - Dynamic SVG gauge displaying future value, total invested, and compound gains.

### 4.9 Verified Student Perks & Deals Hub (`OffersScreen.tsx`)
- Curated student discounts across categories: **Tech**, **Fashion**, **Music**, **Food**, and **Education**.
- Deep links to official platforms (e.g., Apple Education, Spotify Student, GitHub Student Pack, UNiDAYS).
- Calculated savings tracker showing cumulative money saved via student deals.

### 4.10 Settings, Customization & CSV Data Export (`SettingsScreen.tsx` & `csvExport.ts`)
- **Profile Customization:** Instant avatar presets or custom image upload.
- **Monthly Allowance Modifier:** Direct adjustment with instant recalculation of metrics.
- **Theme & Language Toggle:** Dark/Light aesthetics and ENG/HIN toggle.
- **Data Export:** Clean RFC-4180 compliant CSV generation of complete transaction history with timestamps and categories.

---

## 5. Data Models & Type Definitions

Located in [`types.ts`](file:///d:/Jayyy/Hackathon/IQOO_reskill/wiseupai/types.ts):

```typescript
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
```

---

## 6. AI Engine & Prompt Engineering Architecture

Located in [`services/geminiService.ts`](file:///d:/Jayyy/Hackathon/IQOO_reskill/wiseupai/services/geminiService.ts):

### Multimodal Vision Prompt (Receipt Extraction)
```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: { parts: [imagePart, textPart] },
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        merchant: { type: Type.STRING },
        amount: { type: Type.NUMBER },
        date: { type: Type.STRING },
        category: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['Wise', 'Impulsive', 'Considerable'] },
        insight: { type: Type.STRING }
      },
      required: ["merchant", "amount", "date", "category", "type", "insight"]
    }
  }
});
```

### Conversational Guru System Instruction
```
You are WiseupAI Financial Guru.
Context: User Transactions: [...], Goals: [...], Monthly Allowance: ₹[...].

Persona & Language Protocol:
1. Default Mode: A sharp, witty, and slightly judgmental Indian financial expert. Uses relatable "Hinglish".
2. Professional Mode: Clear, structured English if a formal report is requested.
Always provide actionable advice to help the user reach their top financial goal.
```

---

## 7. Design System & UI/UX Aesthetics

- **Color Palette:**
  - **Backgrounds:** Deep Obsidian `#0a0a0a`, `#141210`, `#191714`
  - **Primary Gold Accent:** `#D0BB95` / `#f3b23f` (Luxury financial tone)
  - **Wise (Needs):** Emerald `#22c55e` / `#10b981`
  - **Impulsive (Wants):** Crimson `#ef4444` / `#f43f5e`
  - **Considerable:** Amber `#f59e0b`
- **Typography:** Inter, Plus Jakarta Sans, with clear tabular numeral formatting for currency.
- **Glassmorphism & Micro-animations:** Backdrop blurs (`backdrop-blur-xl`), smooth spring physics on tab changes, and card entry transitions via `motion/react`.

---

## 8. Installation & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- A valid Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Step-by-Step Setup

1. **Clone & Navigate:**
   ```bash
   git clone <repository-url>
   cd wiseupai
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or copy `.env.example`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 9. Verification & Build Health

- **Type Safety:** 100% TypeScript compliance across components and utilities.
- **Vite Bundler:** Build passes cleanly with zero bundle resolution errors.
- **API Key Fallback:** Safe initialization of `@google/genai` prevents runtime crashes if an API key is temporarily absent or invalid.

---

## 10. Post-MVP Roadmap & Future Enhancements

| Phase | Milestone | Features |
| :--- | :--- | :--- |
| **Phase 1 (Current MVP)** | **Core Experience** | • Multimodal Gemini receipt OCR<br>• 3-in-1 Financial Intelligence Hub<br>• Hinglish AI Guru chat & roasts<br>• Proactive budget alerts (80/90/100%)<br>• SIP & Goal tools<br>• CSV export |
| **Phase 2** | **Account Aggregation & SMS** | • Account Aggregator (AA) framework integration for automated bank transaction syncing<br>• Android SMS parsing for UPI transactions (GPay, PhonePe, Paytm) |
| **Phase 3** | **Social & Gamification** | • Split-with-roommates UPI bill splitter<br>• Streak badges and peer saving leaderboards<br>• Group savings challenges with reward coins |
| **Phase 4** | **Intelligent Automated Investing** | • Auto micro-investing of spare change into digital gold/index funds<br>• Direct integration with discount brokers for student SIPs |

---

<div align="center">
  <sub>Built for the Next Generation of Smart Savers • WiseupAI © 2026</sub>
</div>
