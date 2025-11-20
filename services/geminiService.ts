import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCaption } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSocialCaption = async (imageBase64: string, gender: string): Promise<GeneratedCaption> => {
  try {
    const genderText = gender === 'FEMALE' ? 'ženska (glasovala sem)' : 'moški (glasoval sem)';
    
    // Remove header from base64 if present
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64
            }
          },
          {
            text: `
              Analiziraj priloženo sliko. Oseba na sliki (${genderText}) podpira kampanjo "ZA svobodno odločanje o življenju".
              
              Napiši navdihujočo, spoštljivo in kratko objavo za socialna omrežja (Instagram/Facebook), ki poziva k udeležbi na referendumu ali izraža podporo svobodni izbiri.
              
              Odziv mora biti v slovenščini. Vrni rezultat v JSON formatu s poljema "text" (besedilo objave) in "hashtags" (seznam 3-5 hashtagov).
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            hashtags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["text", "hashtags"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedCaption;
    }
    throw new Error("Prazna vsebina iz AI.");
  } catch (error) {
    console.error("Napaka pri generiranju napisa:", error);
    throw error;
  }
};
