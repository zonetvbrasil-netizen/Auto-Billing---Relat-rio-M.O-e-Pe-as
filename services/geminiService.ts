
import { GoogleGenAI } from "@google/genai";
import { BillingRecord } from "../types";

export const analyzeData = async (records: BillingRecord[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const dataSummary = records.map(r => ({
    seguradora: r.insurance,
    total: r.totalValue,
    mo_seguradora: r.laborInsuranceValue,
    mo_concessionaria: r.laborDealershipValue,
    pecas: r.partsValue
  }));

  const prompt = `
    Analise os dados de faturamento de uma funilaria:
    ${JSON.stringify(dataSummary)}
    
    Insights desejados:
    1. Comparação entre lucro de M.O. Seguradora vs Concessionária.
    2. Qual seguradora gera maior volume de peças?
    3. Onde está o maior gargalo ou oportunidade de crescimento?
    Responda em Português (PT-BR) formatado para Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Não foi possível analisar os dados agora.";
  }
};
