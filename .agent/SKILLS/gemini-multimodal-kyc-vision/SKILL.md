---
name: gemini-multimodal-kyc-vision
description: Extracción forense y OCR de documentos de identidad oficiales (INE/IFE, Pasaporte) mediante Gemini 2.0 con esquemas JSON estructurados y cero alucinaciones.
---

# Gemini Multimodal KYC Vision Skill

Este skill es la guía mandatoria para `google_ai_engineer` en el procesamiento multimodal de credenciales de elector y pasaportes.

## 1. Reglas de Inferencia y Modelos
- **SDK Mandatorio:** `@google/genai` (SDK unificado oficial de Google GenAI).
- **Modelo Predeterminado:** `gemini-2.0-flash` para velocidad y coste, o `gemini-2.0-pro` para imágenes con baja iluminación o reflejos.
- **Formato Estricto:** Siempre definir `responseMimeType: "application/json"` con `responseSchema` explícito.

## 2. Esquema JSON de Extracción para INE / Pasaporte
```json
{
  "tipo_documento": "INE" | "PASAPORTE" | "DESCONOCIDO",
  "datos_personales": {
    "nombres": "string",
    "primer_apellido": "string",
    "segundo_apellido": "string",
    "curp": "string (18 caracteres)",
    "clave_elector": "string",
    "fecha_nacimiento": "YYYY-MM-DD",
    "sexo": "H" | "M" | "X"
  },
  "domicilio": {
    "calle_numero": "string",
    "colonia": "string",
    "codigo_postal": "string",
    "municipio": "string",
    "estado": "string"
  },
  "vigencia": {
    "anio_emision": "number",
    "anio_vigencia": "number",
    "es_vigente": "boolean"
  },
  "seguridad_forense": {
    "score_legibilidad": 0.0,
    "es_fotocopia": "boolean",
    "es_pantalla": "boolean",
    "esquinas_completas": "boolean",
    "alertas": ["string"]
  }
}
```

## 3. Reglas Anti-Alucinación Mandatorias
1. NUNCA completar un dato por intuición. Si un caracter de la CURP o Clave de Elector no es nítido, devolver `null` y registrar la advertencia en `alertas`.
2. Validar que la CURP coincida matemáticamente con la fecha de nacimiento y las primeras letras de los apellidos.
3. Detectar si el documento presenta cortes o reflejos que impidan la lectura y solicitar al usuario una nueva captura.
