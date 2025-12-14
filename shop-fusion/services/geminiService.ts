import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Please set your API Key to use AI features.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a sophisticated, short, and selling product description for a fashion item suitable for the Indian market. 
      Product Name: ${productName}. 
      Category: ${category}. 
      Keep it under 50 words. Focus on material, style, and occasion.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description.";
  }
};

export const getStylistAdvice = async (
  query: string, 
  products: Product[]
): Promise<string> => {
  if (!apiKey) return "I can't provide advice without an API key. Please check your configuration.";

  // Create a context string from available products with INR pricing
  const productContext = products.map(p => `- ${p.brand} ${p.name} (₹${p.price}, ${p.category})`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a fashion stylist for Myntra.
      
      User Query: "${query}"

      Available Products in Store:
      ${productContext}

      Task: Recommend items from the store that match the user's request. 
      Explain why they work well together. Be polite, concise, and professional. 
      Focus on current Indian fashion trends (ethnic, fusion, western).
      If no specific product matches perfectly, suggest the closest option or general fashion advice.
      `,
    });
    return response.text || "I'm having trouble finding the perfect match right now.";
  } catch (error) {
    console.error("Gemini Stylist Error:", error);
    return "Sorry, I'm currently offline. Please try again later.";
  }
};

export const generateProductImage = async (prompt: string): Promise<string | null> => {
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-001',
      prompt: `Professional studio product photography of ${prompt}, minimal white background, high fashion, 4k, highly detailed`,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/jpeg'
      }
    });

    const base64Data = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64Data) {
      return `data:image/jpeg;base64,${base64Data}`;
    }
    return null;
  } catch (error) {
    console.error("Imagen Error:", error);
    return null;
  }
};