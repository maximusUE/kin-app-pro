import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  console.log("Buscando modelos disponibles para tu API Key...");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("✅ Modelos disponibles:");
      data.models.forEach((m: any) => console.log(` - ${m.name.replace('models/', '')}`));
    } else {
      console.log("❌ No se encontraron modelos o la API Key es inválida:", data);
    }
  } catch (error) {
    console.error("Error al buscar modelos:", error);
  }
}

listModels();
