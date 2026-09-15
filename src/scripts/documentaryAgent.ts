import 'dotenv/config';
import * as cheerio from 'cheerio';
import { sheets, SPREADSHEET_ID, geminiGenerate, processApprovedRow } from './contentFactoryWorker';

async function fetchArticle(url: string): Promise<string> {
  console.log(`🌐 Extrayendo mega-artículo desde: ${url}`);
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    // Eliminar nav, footer, scripts, etc.
    $('nav, footer, script, style, aside, header').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    console.log(`✅ Artículo extraído: ${bodyText.length} caracteres.`);
    return bodyText.substring(0, 8000); // Reducido a 8k chars por límite TPM (incluye output de 8k)
  } catch (error) {
    console.error('⚠️ Error extrayendo el artículo:', error);
    return '';
  }
}

async function runDocumentaryAgent() {
  console.log('🎬 INICIANDO GENERADOR DE DOCUMENTALES (18 MINUTOS) 🎬');

  const url = 'https://elrincondeaquiles.com/estoicismo/';
  const contexto = await fetchArticle(url);

  if (!contexto) {
    console.log('❌ No se pudo extraer el artículo. Abortando.');
    return;
  }

  console.log('🧠 Escribiendo el documental... (Esto puede tomar hasta 2 minutos debido a la longitud)');

  const prompt = `Role: Eres un guionista experto, mentor, director implacable y estratega de creación de contenido para el canal "Código Propio". Tienes más de 15 años de experiencia, habiendo desarrollado tu mayor experiencia en canales de YouTube de alto impacto, por lo que eres un experto absoluto en crear guiones auténticos y de alta retención. Eres directo, pragmático y "no-nonsense". Hablas como una persona real con autoridad y franqueza, sin sonar jamás como una inteligencia artificial.

Target Audience: Tu público objetivo son personas emprendedoras, dueños de pequeños negocios y personas con deseos de seguir creciendo en todas las áreas tratadas en el canal (estoicismo, finanzas y negocios). Te diriges a un público adulto con un rango de edad de entre 25 y más de 45 años.

Objective: Generar un GUION MASIVO TIPO DOCUMENTAL (aprox 15 a 18 minutos) sobre "Estoicismo". ¡CRÍTICO!: Aunque el contexto hable de estoicismo general, tú DEBES darle un enfoque totalmente dirigido hacia los NEGOCIOS, LAS FINANZAS, EL DINERO y EL EMPRENDIMIENTO. Traduce cada principio estoico en estrategias prácticas para sobrevivir a la presión financiera, liderar equipos, manejar deudas y soportar el estrés brutal de tener un negocio. Basate en el siguiente contexto extraído del "Rincón de Aquiles":

CONTEXTO EXTRAÍDO:
"""
${contexto}
"""

Instructions (Constraints & Narrowing):
- REGLAS DE RETENCIÓN Y ESTRUCTURA (¡CRÍTICO!):
  * PROHIBIDO SALUDAR: Bajo ninguna circunstancia digas "Hola", "Bienvenidos", o introducciones de presentador. El guion debe empezar en el segundo cero con una bofetada mental (un gancho visceral y polarizante).
  * EVITAR REPETICIONES Y ESTRUCTURAS FÓRMULA (¡CRÍTICO!):
    - PROHIBIDO empezar párrafos o principios consecutivos usando el mismo patrón gramatical (ej. "La disciplina es...", "La aceptación es...", "El principio X se refiere a...", "Según el artículo...").
    - Varía radicalmente la apertura de cada uno de los 7 principios. Por ejemplo, introduce uno con una historia corta o ejemplo de quiebra, otro con una pregunta incómoda de dinero, otro con una analogía (ej. boxeo o ajedrez), otro con una cita directa potente, etc.
    - PROHIBIDO usar transiciones robóticas o escolares (ej. "El siguiente principio es...", "Pasando a la siguiente clave...", "Otro punto importante es..."). La transición debe fluir de forma natural usando la narrativa de negocios, retos y mentalidad.
  * SOBRE LAS CITAS Y LA FUENTE (CREDIT RULE):
    - Menciona a "El Rincón de Aquiles" ÚNICAMENTE UNA VEZ, de forma totalmente natural en la introducción o al inicio del primer principio (ej. "Inspirados en los análisis estoicos de El Rincón de Aquiles...").
    - PROHIBIDO repetir "según el artículo", "como se menciona en el artículo", o referenciar la fuente o el artículo repetidamente a lo largo del desarrollo de los principios.
  * MINI-HOOKS (BUCLES ABIERTOS): Como es un guion masivo, debes inyectar "mini-ganchos" cada pocos minutos para retener a la audiencia. (Ej: "Pero lo que descubrió después destruye todo lo que te han enseñado sobre la disciplina...").
  * EXTENSIÓN MASIVA (CRÍTICO): Debes escribir un guion de al menos 2,500 palabras (mínimo 15 a 18 minutos de lectura pausada). No resumas ni recortes explicaciones. Explica cada concepto a profundidad, con metáforas detalladas, historias ilustrativas y ejemplos del mundo real de los negocios y finanzas.
  * ESTRUCTURA DETALLLADA POR OBJETIVO DE PALABRAS:
    - Introducción (Hook inicial disruptivo + planteamiento del problema): Al menos 400 palabras.
    - Desarrollo (Desarrolla EXACTAMENTE 7 principios clave del estoicismo encontrados en el contexto, dedicando al menos 270 palabras de explicación detallada, analogía de negocios/finanzas y anécdotas para cada uno de los 7 principios): Mínimo 1,900 palabras en total para esta sección.
    - Conclusión (Cierre impactante y desarrollo de los 3 pasos accionables detallados): Al menos 300 palabras.
    Total acumulado esperado: 2,600+ palabras.
  * OBLIGATORIO: Integra al menos 1 o 2 datos o estadísticas poderosas provenientes del texto o deducciones directas.
- REGLAS DE TONO:
  * Escribe para ser hablado (oralidad). Usa oraciones secas y contundentes.
  * OBLIGATORIO - PAUSAS Y ENTONACIÓN HUMANA (Optimizado para TTS/CapCut):
    - Usa puntos suspensivos ("...") frecuentemente a lo largo del guion para forzar silencios dramáticos de reflexión, intriga o misterio.
    - Alterna oraciones cortas con preguntas directas e incómodas (ej: "¿Por qué sigues ahí?", "¿Tiene sentido?") y exclamaciones contundentes (ej: "¡Cero!", "¡Es una trampa!"). Esto obliga al motor de CapCut a elevar y variar la entonación, eliminando la voz plana artificial.
    - Utiliza comas (,) y puntos y comas (;) de forma constante para estructurar pausas medias y micro-variaciones de ritmo.
  * PALABRAS ESTRICTAMENTE PROHIBIDAS: "adentrémonos", "crucial", "fundamental", "fascinante", "en resumen", "sin duda", "acompáñame".
- MARCADORES DE EXPERIENCIA:
  * Inserta de 3 a 4 marcadores entre llaves {} a lo largo del documental para anécdotas de César. (Ej: {César: Inserta aquí una experiencia de cuando sufrías ansiedad por dinero...}).

Output Format:
No uses JSON. Responde ÚNICAMENTE con la siguiente estructura exacta de etiquetas, llenando cada sección.

[TITULO]
(El título más viral aquí)
[FIN_TITULO]

[GUION]
(El mega guion con párrafos reales, saltos de línea reales y marcadores aquí)
[FIN_GUION]

[VISUAL_QUERIES]
(Las queries DEBEN estar en INGLÉS, ser muy cortas (2 a 4 palabras) y pensadas para bancos de video gratuitos como Pexels/Pixabay.
REGLAS TEMÁTICAS DE B-ROLL (¡CRÍTICO!):
Como este megadocumental cruza el Estoicismo con Negocios y Finanzas, debes generar una mezcla coherente y balanceada de las siguientes categorías de video, asegurando que coincidan con la narrativa del guion:
1. ESTOICISMO / CLÁSICO: Personajes antiguos, ruinas clásicas de Grecia y Roma, estatuas, templos, columnas de mármol (ej: "ancient ruins", "greek temple", "roman statue", "marble bust", "ancient athens cliff", "stone pillars").
2. NEGOCIOS / EMPRENDIMIENTO: Pequeños negocios locales, cafeterías, panaderías, delis, restaurantes, oficinas de startups y emprendedores trabajando (ej: "small coffee shop owner", "local bakery kitchen", "restaurant chef busy", "entrepreneur working laptop", "team office meeting", "deli store counter").
3. FINANZAS / DINERO: Billetes, monedas acumuladas, pantallas con gráficos de acciones en tiempo real, análisis financieros, tarjetas de crédito, etc. (ej: "counting paper money", "golden coins stack", "stock market chart screen", "financial analysis graph", "credit card payment", "investment success").
4. FONDOS ABSTRACTOS DE RETENCIÓN (estilo CapCut): Fondos oscuros de bucles geométricos, neón, partículas o humo lento para mezclar y mantener la retención visual alta (ej: "dark abstract neon loop", "cinematic geometric lines motion", "retro grid background looping", "slow smoke dark background").

- PROHIBIDO usar nombres propios o acciones hiper-específicas porque los bancos de video devolverán basura aleatoria (ej: "Marco Aurelio hablando en Roma" o "hombre de negocios enojado con el banco HSBC").
- Genera al menos 40 queries cinemáticas distintas siguiendo estas pautas exactas)
[FIN_VISUAL_QUERIES]

[DIAPOSITIVA]
(Texto de la diapositiva acreditado)
[FIN_DIAPOSITIVA]
`;

  try {
    const rawText = await geminiGenerate(prompt);

    const tituloMatch = rawText.match(/\[TITULO\]([\s\S]*?)\[FIN_TITULO\]/);
    const guionMatch = rawText.match(/\[GUION\]([\s\S]*?)\[FIN_GUION\]/);
    const queriesMatch = rawText.match(/\[VISUAL_QUERIES\]([\s\S]*?)\[FIN_VISUAL_QUERIES\]/);
    const diapoMatch = rawText.match(/\[DIAPOSITIVA\]([\s\S]*?)\[FIN_DIAPOSITIVA\]/);

    if (!tituloMatch || !guionMatch) {
      throw new Error("No se pudo extraer correctamente las secciones del LLM. Reintenta.");
    }

    const tituloSugerido = tituloMatch[1].trim();
    const guion = guionMatch[1].trim();
    const diapositivasTexto = diapoMatch ? diapoMatch[1].trim() : '';
    
    // Parsear queries por línea (ignorando vacías)
    const queriesRaw = queriesMatch ? queriesMatch[1].trim() : '';
    const visualQueries = queriesRaw.split('\n').map(q => q.replace(/^[-\*\d\.\(\)]+\s*/, '').trim()).filter(q => q.length > 0);

    console.log('📝 Inyectando Mega-Documental en Google Sheets...');
    
    const rowsToInsert = [
      ['En revision', '', '', '', 'Estoicismo', tituloSugerido, guion, JSON.stringify(visualQueries), '', diapositivasTexto, url]
    ];

    // Buscar la primera fila libre en la columna A para evitar desplazamientos
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Matriz!A:A',
    });
    const nextRow = (getRes.data.values || []).length + 1;

    const appendRes = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Matriz!A${nextRow}:K${nextRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rowsToInsert },
    });

    console.log(`✅ ¡Mega-Documental de 18 Minutos creado e insertado exitosamente! Rango actualizado: ${appendRes.data.updatedRange || `Matriz!A${nextRow}:K${nextRow}`}`);
    console.log(`   👉 Título: ${tituloSugerido}`);
    console.log(`   👉 Palabras generadas: ${guion.split(' ').length}`);
    console.log(`   👉 Queries generadas: ${visualQueries.length}`);

    // Iniciar descarga automática de videos en segundo plano
    console.log(`🎬 Iniciando descarga automática de B-Roll para el Mega-Documental (Fila ${nextRow})...`);
    console.log(`   (Puedes empezar a humanizar el guion en tu Dashboard mientras se descargan los clips en segundo plano)`);
    await processApprovedRow(nextRow, 'videos_only').catch(err => {
      console.error('⚠️ Error en la descarga automática de videos:', err);
    });

    console.log(`🏁 Proceso completado. ¡Todo listo!`);

  } catch (err: any) {
    console.error('❌ Error generando o guardando el Documental:', err.message);
  }
}

runDocumentaryAgent();
