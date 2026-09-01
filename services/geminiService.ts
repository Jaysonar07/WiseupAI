
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Helper to get a new instance of the GoogleGenAI client.
 * Move instantiation to the last possible moment to prevent app-wide crashes.
 */
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  // If no key is set, we return null so callers can handle it gracefully 
  // without the library throwing a "missing key" error in the constructor.
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI", e);
    return null;
  }
};

const NO_KEY_ERROR = "Guru's brain is not connected! Please set your Gemini API_KEY in the hosting environment variables.";

export const getFinancialAdvice = async (prompt: string, context: { transactions: any[], goals: any[], monthlyAllowance: number }) => {
  const ai = getAIInstance();
  if (!ai) return NO_KEY_ERROR;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are WiseupAI Financial Guru. 
      Context: User Transactions: ${JSON.stringify(context.transactions)}, Goals: ${JSON.stringify(context.goals)}, Monthly Allowance: ₹${context.monthlyAllowance}.
      
      Persona & Language Protocol:
      1. Default Mode: A sharp, witty, and slightly judgemental Indian financial expert. Uses "Hinglish".
      2. Professional Mode: Clear, structured English if formal report requested.
      
      Always provide actionable advice to help the user reach their top financial goal.`,
      temperature: 0.7,
    }
  });
  
  return response.text;
};

export const analyzeReceipt = async (base64Image: string, context: { goals: any[], monthlyAllowance: number }) => {
  const ai = getAIInstance();
  if (!ai) throw new Error(NO_KEY_ERROR);

  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image.split(',')[1],
    },
  };

  const textPart = {
    text: `Analyze this receipt. Return as JSON. Merchant, Amount, Date, Category, Type (Wise, Impulsive, Considerable), Insight.`
  };

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

  return JSON.parse(response.text || '{}');
};

export const classifyManualExpense = async (merchant: string, amount: number, context: { goals: any[], monthlyAllowance: number }) => {
  const ai = getAIInstance();
  if (!ai) throw new Error(NO_KEY_ERROR);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Classify expense: ${merchant} for ₹${amount}. Monthly Allowance: ₹${context.monthlyAllowance}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['Wise', 'Impulsive', 'Considerable'] },
          insight: { type: Type.STRING }
        },
        required: ["category", "type", "insight"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
