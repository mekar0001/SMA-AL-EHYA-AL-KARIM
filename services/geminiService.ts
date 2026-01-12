
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const refineReportContent = async (field: string, text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Sebagai seorang penolong kanan sekolah yang profesional, tolong murnikan ayat untuk bahagian "${field}" dalam Laporan Program (OPR) berikut supaya lebih formal dan padat dalam Bahasa Melayu. Kekalkan maksud asal. Hanya berikan teks yang telah dimurnikan sahaja.

Teks asal: "${text}"`,
    config: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  });

  return response.text || text;
};

export const suggestObjectives = async (programName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Berikan 3 objektif program yang mantap untuk program sekolah bertajuk "${programName}" dalam format senarai bernombor. Bahasa Melayu yang profesional.`,
  });

  return response.text || "";
};
