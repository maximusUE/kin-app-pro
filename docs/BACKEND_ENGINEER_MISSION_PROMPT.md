# 🛡️ BRIEFING MAESTRO DE INGENIERÍA BACKEND — ECOSISTEMA FINTECH KIN MOBILE
**De:** Agente Especialista en Arquitectura de Prompts & Sistemas  
**Para:** `security_backend_dev` (Lead Fintech Security & Core Banking Architect)  
**Proyecto:** KIN Mobile — Remesas Transfronterizas USA ⇄ México, SPEI Banxico & Servicios Financieros  
**Fecha:** Septiembre 2026  
**Clasificación:** Confidencial / Core Banking Infrastructure  

---

## 1. 🎯 PROPÓSITO Y CONTEXTO ESTRATÉGICO
El usuario final va a realizar **pruebas integrales de punta a punta (End-to-End)** simulando ser un **nuevo cliente**. El flujo contempla:
1. Registro desde cero (Onboarding con nombre, teléfono, correo y contraseña segura).
2. Autenticación biométrica Face ID / Passkeys y sesión persistente.
3. Consulta reactiva de balance y saldos duales (USD / MXN en tránsito y disponible).
4. Despacho de transferencias transfronterizas vía **SPEI Banxico** con validación algorítmica de CLABE (18 dígitos módulo-10) y generación de Clave de Rastreo Banxico de 24 caracteres alfanuméricos.
5. Pago de servicios esenciales en México (CFE, Telmex, Naturgy, Agua Potable, etc.) con generación de folios fiscales SAT CFDI 4.0.
6. Transferencias P2P instantáneas con **KIN Cash**.
7. Bóveda documental cifrada **ClientVault** (Zero-Knowledge AES-GCM-256) y validación de identidad KYC forense con **Google Gemini 2.0**.

---

## 2. 🏛️ REGLAS DE NEGOCIO Y HABILIDADES ESPECIALIZADAS ACTIVAS

### A. Rieles de Pago SPEI Banxico (`spei-banxico-fintech-engine`)
* **Validación de CLABE Interbancaria (18 dígitos):**
  * Ponderación matemática Banxico: secuencia `[3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7]` módulo 10.
  * Extracción de código de banco (`002` Banamex, `012` BBVA, `014` Santander, `072` Banorte, `127`/`646` STP, `137` BanCoppel, `130` Banco Azteca, etc.).
  * Si el dígito verificador 18 no coincide, la transferencia debe ser rechazada de inmediato con código de error bancario `INVALID_CLABE_CHECKSUM`.
* **Clave de Rastreo Banxico:** Formato oficial alfanumérico inmutable de 24 caracteres (ej. `KIN202609191934018294710123`).

### B. Cumplimiento AML / PLD (CNBV, SAT y FinCEN) (`fintech-aml-pld-compliance`)
* **Nivel 1 (Tier 1 - Nuevo Cliente / Onboarding):**
  * Límite diario: **$300.00 USD**.
  * Límite mensual: **$750.00 USD**.
* **Nivel 2 (Tier 2 - Verificado KYC con Gemini):**
  * Límite diario: **$1,500.00 USD**.
  * Límite mensual: **$3,000.00 USD**.
* **Nivel 3 (Tier 3 - Alto Volumen):**
  * Límite diario: **$5,000.00 USD**.
  * Límite mensual: **$10,000.00+ USD**.
* **Regla estricta:** Ninguna transferencia puede procesarse si excede el saldo en cuenta o los límites de su nivel AML.

### C. Seguridad Bancaria Zero-Knowledge (`zero-knowledge-vault-security`)
* Cifrado en cliente con AES-GCM-256. El servidor nunca recibe llaves maestras en texto claro.

### D. Extracción Forense Multimodal KYC (`gemini-multimodal-kyc-vision`)
* OCR forense con Google Gemini 2.0 y `@google/generative-ai`.
* Esquema estructurado JSON estricto (`responseSchema`).
* Detección de fotocopias, pantallas o alteraciones sin alucinaciones.

---

## 3. 🛠️ ESPECIFICACIONES DE LOS ENDPOINTS REQUERIDOS

| Ruta API | Método | Descripción Técnica |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Registra un nuevo usuario, crea su ID único KIN (`KIN-US-XXXXXX`), asigna balance de bienvenida inicial ($1,000.00 USD para pruebas inmediatas), y nivel Tier 1. |
| `/api/auth/login` | `POST` | Valida credenciales por correo/teléfono o token biométrico Face ID. Retorna perfil de usuario y token de sesión. |
| `/api/account/data` | `GET` / `POST` | Obtiene el estado consolidado: perfil del cliente, saldo USD, equivalente MXN (tasa fija 20.45), historial de transacciones y contactos frecuentes. |
| `/api/spei/transfer` | `POST` | Ejecuta envío SPEI: valida CLABE 18 dígitos, verifica límites AML Tier 1/2, descuenta saldo, genera Clave de Rastreo de 24 caracteres y comprobante CEP. |
| `/api/bills/pay` | `POST` | Paga recibos (CFE, Telmex, etc.): valida referencia, descuenta balance en USD, emite folio fiscal SAT CFDI 4.0 UUID y comprobante instantáneo. |
| `/api/kin-cash/send` | `POST` | Envío P2P en tiempo real a teléfono o @tag KIN con confirmación inmediata. |
| `/api/contacts` | `GET` / `POST` / `DELETE` | Gestión de contactos y beneficiarios reales del usuario (creación, edición y eliminación de contactos desde cero). |
| `/api/kyc/verify` | `POST` | Procesa imagen de documento (INE/Pasaporte) mediante la SDK `@google/generative-ai` y valida identidad. |

---

## 4. ☁️ BASE DE DATOS OFICIAL: GOOGLE FIREBASE (FIRESTORE & AUTH)
**La base de datos oficial del proyecto está establecida en Google Firebase (Cloud Firestore)**:
* **Colecciones Principales en Firestore:**
  1. `users/{userId}`: Documento principal del perfil de cliente (nombre, email, teléfono, balanceUSD, kycTier, limits, clientId, memberSince).
  2. `users/{userId}/contacts/{contactId}`: Beneficiarios reales registrados por el cliente (comenzando en blanco, sin contactos ficticios de demo).
  3. `users/{userId}/transactions/{txId}`: Ledger contable inmutable con `claveRastreoBanxico`, folios fiscales `satFolioFiscalUuid`, montos y marcas de tiempo.
  4. `users/{userId}/vault/{docId}`: Metadatos y blobs cifrados Zero-Knowledge AES-GCM-256 de ClientVault.
* **Capa de Conexión & Resiliencia:**
  - Integración mediante Google Cloud / Firebase Service Account (`bot-hojas@robot-codigo-propio.iam.gserviceaccount.com`).
  - Cache local resiliente de alta disponibilidad (`data/kin_db.json`) sincronizado con Firebase para garantizar cero latencia y tolerancia a fallos offline en testing.

---

## 5. 🧹 POLÍTICA DE DATOS LIMPIOS (CLEAN SLATE)
* **Cero Contactos Ficticios:** La lista de contactos debe iniciar en `0` (vacía). Cada registro que aparezca en el dashboard debe ser creado voluntariamente por el usuario durante sus pruebas.
* **Cero Transacciones Basura:** El historial inicia limpio para el nuevo usuario registrado, mostrando únicamente su saldo de bienvenida y los registros que él mismo vaya ejecutando.

---

## 6. 🚀 CRITERIOS DE ACEPTACIÓN INMEDIATA
1. **Compilación Limpia:** Ejecutar `npx tsc --noEmit` y asegurar **0 errores**.
2. **Registro Real y Limpio:** Un nuevo usuario debe poder ingresar sus datos en la pantalla de registro, entrar al dashboard limpio con su saldo real y 0 contactos ficticios.
3. **Agregar Contactos Reales:** El usuario debe poder dar clic en "+ Agregar Contacto", guardar sus datos reales, y ver cómo se registran inmediatamente en el backend y aparecen en la lista.
4. **Descuento de Saldos:** Al realizar un SPEI o pagar un recibo, el saldo en el dashboard debe descontarse inmediatamente y la transacción debe aparecer en el historial superior.
