# ⚖️ Cumplimiento Regulatorio, AML/PLD y KYC Forense con IA (03_AML_KYC_COMPLIANCE)

> **Documento:** 03_AML_KYC_COMPLIANCE.md  
> **Módulo:** Prevención de Lavado de Dinero (PLD) y Verificación de Identidad  
> **Normativas:** FinCEN (EE.UU.), BSA (Bank Secrecy Act), CNBV / SHCP (México)  
> **Código de Referencia:** [`kyc/verify/route.ts`](file:///Users/cesarue/Desktop/Proyecto%20YouTube/src/app/api/kyc/verify/route.ts)  

---

## 1. 📜 Marco Legal y Obligaciones Regulatorias

Como plataforma de remesas transfronterizas entre Estados Unidos y México, KIN está sujeta a las normativas de dos jurisdicciones soberanas:

1. **Estados Unidos (FinCEN / MSB - Money Services Business):**
   - Cumplimiento de la **Bank Secrecy Act (BSA)** y la **USA PATRIOT Act**.
   - Detección de transacciones sospechosas (SAR - *Suspicious Activity Report*) y umbrales de reporte de operaciones en efectivo (CTR).
   - Verificación de listas de sanciones de la OFAC (Office of Foreign Assets Control).

2. **México (CNBV - Comisión Nacional Bancaria y de Valores):**
   - Cumplimiento de las Disposiciones de Carácter General en materia de Prevención de Operaciones con Recursos de Procedencia Ilícita (PLD/FT).
   - Identificación de clientes mediante documentos oficiales emitidos por el gobierno mexicano (INE / Pasaporte).

---

## 2. 🏛️ Matriz Escalonada de Tiers KYC y Límites Transaccionales

Para brindar una experiencia de usuario rápida sin descuidar el cumplimiento de la ley, KIN utiliza una matriz de verificación progresiva en 3 niveles (*Tiers*):

| Nivel KYC | Límite Diario | Límite Mensual | Requisitos para Desbloquear | Procedimiento de Validación |
| :--- | :---: | :---: | :--- | :--- |
| **Tier 1 (Básico)** | **\$1,000 USD** | **\$3,000 USD** | • Nombre legal completo<br>• Teléfono móvil validado por SMS/OTP<br>• Correo electrónico | Instantáneo al registrarse en la plataforma. |
| **Tier 2 (Identidad Oficial)** | **\$3,000 USD** | **\$5,000 USD** | • Documento oficial vigente (Credencial INE/IFE o Pasaporte Mexicano/USA) | **Automático vía IA Gemini 2.0 Multimodal** en menos de 5 segundos. |
| **Tier 3 (Comercial / Avanzado)** | **\$10,000 USD** | **\$25,000 USD** | • Comprobante de domicilio reciente (< 90 días)<br>• Número de Seguro Social (SSN), ITIN o RFC mexicano | Revisión de cumplimiento reforzada con respaldo documental. |

---

## 3. 👁️ Motor de Peritaje Forense KYC con Google Gemini 2.0

En lugar de requerir costosas revisiones manuales de 48 horas, KIN implementa un pipeline serverless con **Google Gemini 2.0 Multimodal** (`/api/kyc/verify`) que analiza la fotografía de la identificación en tiempo real.

### Blindaje contra Inyección de Prompts (*Prompt Defense*):
El documento subido por el usuario se encapsula dentro del delimitador `<kyc_document_image>` y se le ordena al modelo que cualquier texto dentro del plástico (ej. frases escritas para engañar a la IA) sea tratado como imagen inerte y no como instrucciones.

### Esquema Estructurado de Extracción (JSON Schema Forzado):
Gemini devuelve exclusivamente este esquema tipado:

```json
{
  "tipo_documento": "INE",
  "datos_personales": {
    "nombres": "César",
    "primer_apellido": "Urrutia",
    "segundo_apellido": "Eligio",
    "curp": "URRE880914HDFRLS03",
    "clave_elector": "URREEL88091409H400",
    "fecha_nacimiento": "1988-09-14",
    "sexo": "H"
  },
  "vigencia": {
    "anio_emision": 2022,
    "anio_vigencia": 2032,
    "es_vigente": true
  },
  "seguridad_forense": {
    "score_legibilidad": 0.98,
    "es_fotocopia": false,
    "es_pantalla": false,
    "esquinas_completas": true,
    "alertas": []
  },
  "nuevo_tier": "Tier 2 (Identidad Oficial Verificada)"
}
```

### Reglas de Rechazo Inmediato del Peritaje Forense:
1. **Documento Vencido (`es_vigente == false`):** La identificación no es válida para transacciones financieras.
2. **Foto de una pantalla (`es_pantalla == true`):** El usuario intentó tomarle foto a un monitor o tablet (intento de suplantación de identidad).
3. **Fotocopia en blanco y negro (`es_fotocopia == true`):** Se exige el plástico original físico.
4. **Esquinas cortadas (`esquinas_completas == false`):** Evita el uso de documentos adulterados o recortados.
5. **Legibilidad baja (`score_legibilidad < 0.80`):** Imagen borrosa o con brillo excesivo; se le solicita al usuario tomar una nueva foto con mejor luz.

---

## 4. 🚨 Detección de Patrones Sospechosos (Anti-Smurfing)

KIN cuenta con reglas de monitoreo automatizado de transacciones:

1. **Estructuración (*Smurfing*):** Múltiples envíos de \$990 USD en un mismo día para evadir el límite de \$1,000 USD de Tier 1 activan una congelación preventiva del usuario hasta completar la verificación Tier 2.
2. **Dispersión a Múltiples Beneficiarios Desconocidos:** Envío a más de 5 cuentas CLABE distintas en menos de 2 horas activa revisión de seguridad.
3. **Control de Duplicidad:** El mismo número de CURP o Clave de Elector no puede asociarse a dos cuentas de KIN distintas.

---

## 5. 📜 Divulgaciones Obligatorias CFPB (Regulation E) y Privacidad GLBA

Para cumplir con los requerimientos de la **Consumer Financial Protection Bureau (CFPB 12 CFR Part 1005, Subpart B)** y la **Gramm-Leach-Bliley Act (GLBA)** antes del despliegue en producción y aprobación de las tiendas (Apple/Google), KIN integra el componente [`LegalDisclaimersCard.tsx`](file:///Users/cesarue/Desktop/Proyecto%20YouTube/src/components/LegalDisclaimersCard.tsx):

1. **Pre-Payment Disclosure Obligatorio:** Desglose del tipo de cambio exacto, comisiones, total a debitar en USD y monto garantizado a recibir en MXN antes de autorizar.
2. **Transparencia en Ganancia Cambiaria (FX Spread):** Cláusula legal explícita declarando los ingresos obtenidos por el diferencial de tipo de cambio.
3. **Derecho Federal de Cancelación en 30 Minutos:** Garantía de reembolso del 100% de fondos y tarifas si la cancelación se solicita dentro de los 30 minutos posteriores a la orden (siempre que los fondos no hayan sido liquidados o cobrados).
4. **Advertencia de Comisiones de Terceros:** Aviso sobre cargos por disposición de efectivo en tarjetas de crédito por parte de bancos emisores.
5. **Protección de Datos y Privacidad Zero-Knowledge:** Cifrado en dispositivo AES-GCM-256 (ClientVault); los datos de medios de pago no se comparten ni se comercializan.
6. **Resolución de Errores y Autoridades Reguladoras:** Canales directos de aclaración (180 días) y datos de contacto de la CFPB en EE.UU. y CONDUSEF en México.
