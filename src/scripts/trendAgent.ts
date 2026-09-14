import 'dotenv/config';
import { sheets, SPREADSHEET_ID, geminiGenerate } from './contentFactoryWorker.ts';

interface RedditPost {
  title: string;
  selftext: string;
}

async function fetchSubredditTop(subreddit: string): Promise<string> {
  console.log(`📡 Cazando tendencias en r/${subreddit}...`);
  try {
    const res = await fetch(`https://www.reddit.com/r/${subreddit}/top/.json?t=day&limit=10`);
    const data = await res.json();
    const posts = data.data.children.map((c: any) => c.data.title).join('\n');
    return posts;
  } catch (error) {
    console.error(`Error obteniendo datos de r/${subreddit}:`, error);
    return '';
  }
}

async function runTrendAgent() {
  console.log('🤖 INICIANDO AGENTE CAZADOR DE TENDENCIAS 🤖');
  
  const processPilar = process.env.PROCESS_PILAR;
  if (processPilar) {
    console.log(`🎯 Filtrando para pilar único: ${processPilar}`);
  }

  // 1. Recolectar dolores diarios
  let stoicismData = '';
  let financeData = '';
  let businessData = '';

  if (!processPilar || processPilar === 'Estoicismo') {
    stoicismData = await fetchSubredditTop('stoicism');
  }
  if (!processPilar || processPilar === 'Finanzas') {
    financeData = await fetchSubredditTop('personalfinance');
  }
  if (!processPilar || processPilar === 'Negocios') {
    businessData = await fetchSubredditTop('Entrepreneur');
  }

  // 2. Cerebro Analítico
  console.log('🧠 Analizando dolores con AI para diseñar la estrategia...');
  let prompt = `Role: Eres un productor maestro de YouTube. Analizas los problemas actuales de las personas y diseñas temas de videos virales que resuelven esos dolores exactos.

Aquí están las quejas y temas más discutidos HOY en foros clave:
${stoicismData ? `ESTOICISMO: ${stoicismData.slice(0, 500)}\n` : ''}${financeData ? `FINANZAS: ${financeData.slice(0, 500)}\n` : ''}${businessData ? `NEGOCIOS: ${businessData.slice(0, 500)}\n` : ''}`;

  if (processPilar) {
    prompt += `
Objective:
Diseña exactamente 1 tema de YouTube para el pilar "${processPilar}".
El tema debe ser altamente viral, accionable y diseñado para resolver el dolor detectado.

Output Format:
Responde ÚNICAMENTE con un objeto JSON válido, sin bloques Markdown.
[
  { "pilar": "${processPilar}", "tema": "Título altamente viral y accionable", "contexto": "Extrae un dato estadístico o problema MUY ESPECÍFICO de los posts analizados para usar de contexto real." }
]`;
  } else {
    prompt += `
Objective:
Diseña exactamente 3 temas de YouTube (uno para el Lunes de Estoicismo, otro para el Miércoles de Finanzas, y otro para el Viernes de Negocios).
Los 3 temas deben complementarse entre sí, manteniendo un hilo conductor o enfoque filosófico para que el canal tenga consistencia durante la semana.

Output Format:
Responde ÚNICAMENTE con un objeto JSON válido, sin bloques Markdown.
[
  { "pilar": "Estoicismo", "tema": "Título altamente viral y accionable", "contexto": "Extrae un dato estadístico o problema MUY ESPECÍFICO de los posts analizados para usar de contexto real." },
  { "pilar": "Finanzas", "tema": "Título altamente viral y accionable", "contexto": "Extrae un dato estadístico o problema MUY ESPECÍFICO de los posts analizados para usar de contexto real." },
  { "pilar": "Negocios", "tema": "Título altamente viral y accionable", "contexto": "Extrae un dato estadístico o problema MUY ESPECÍFICO de los posts analizados para usar de contexto real." }
]`;
  }

  const rawText = await geminiGenerate(prompt);
  let topics = [];
  try {
    const clean = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    topics = JSON.parse(clean);
  } catch (err) {
    console.error('❌ Error parseando la respuesta de la AI:', err);
    return;
  }

  // 3. Inyectar a la Fábrica (Google Sheets)
  console.log('📝 Inyectando temas en Google Sheets...');
  const rowsToInsert = topics.map((t: any) => [
    'Pendiente', '', '', '', t.pilar, t.tema, '', '', '', '', t.contexto || ''
  ]);

  try {
    // Buscar la primera fila libre en la columna A para evitar desplazamientos
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Matriz!A:A',
    });
    const nextRow = (getRes.data.values || []).length + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Matriz!A${nextRow}:K${nextRow + rowsToInsert.length - 1}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rowsToInsert },
    });
    console.log(`✅ ¡${topics.length} nuevo(s) tema(s) insertado(s) en su Fábrica listos para producirse!`);
    topics.forEach((t: any) => console.log(`   👉 [${t.pilar}] ${t.tema}`));
  } catch (error: any) {
    console.error('❌ Error guardando en Google Sheets:', error.message);
  }
}

runTrendAgent();
