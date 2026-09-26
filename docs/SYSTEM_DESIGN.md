# 🏛️ SYSTEM DESIGN — KIN FINTECH & REMITTANCE PLATFORM

> **Versión:** 2.0.0 — Producción y Staging Vercel / Firestore  
> **Proyecto:** KIN App (`kin-app-pro`)  
> **Repositorio:** `maximusUE/kin-app-pro`  
> **Última Actualización:** 25 de Septiembre, 2026  

---

## 1. Visión General & Dominio

**KIN** es una plataforma móvil y web de servicios financieros transfronterizos enfocada en la diáspora mexicana en Estados Unidos y sus familias en México:

1. **Remesas USA ➔ México (SPEI Banxico):** Envíos en tiempo real con tipo de cambio FX transparente y dispersión bancaria directa a CLABEs de 18 dígitos.
2. **Pago de Servicios (Bill Pay):** Pago directo de servicios esenciales (CFE Luz, Telmex, Izzi, Totalplay, Dish) y tiempo aire desde el saldo USD.
3. **Transferencias P2P (KIN Cash):** Transferencias entre usuarios de KIN sin comisiones, con sincronización de contactos de WhatsApp.
4. **ClientVault:** Bóveda de seguridad con cifrado del lado del cliente y soporte biométrico (WebAuthn / FaceID).

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión / Detalle |
| :--- | :--- | :--- |
| **Runtime & Framework** | Next.js (App Router) + TypeScript | Next.js 14.2.3, TS ^5 |
| **Estilos & UI** | Tailwind CSS + Lucide Icons | Ergonomía iOS 18 HIG & Material 3 |
| **Base de Datos Cloud** | Google Cloud Firestore | Proyecto `kin-app-prod-b97c0` vía REST OAuth2 |
| **Motor Bancario** | Algoritmo SPEI Banxico | Validación CLABE Módulo 10 ponderado |
| **Inteligencia Artificial** | Google Gemini 2.0 Multimodal | Extracción forense KYC de INE / Pasaporte |
| **Hosting & Deploy** | Vercel | Despliegue continuo 24/7 con HTTPS |

---

## 3. Estructura de Carpetas del Proyecto

```
src/
├── app/
│   ├── api/                     # Serverless API routes
│   │   ├── auth/                # Login, Register, JWT sessions
│   │   ├── spei/                # Transferencias bancarias SPEI Banxico
│   │   ├── bills/               # Pago de CFE, Telmex, Izzi, recargas
│   │   ├── kin-cash/            # Transferencias P2P KIN Cash
│   │   ├── kyc/                 # Verificación de identidad multimodal
│   │   ├── contacts/            # Sincronización de contactos WhatsApp/vCard
│   │   └── account/             # Datos de perfil y balances
│   ├── auth/                    # Pantalla de autenticación bilingüe
│   ├── layout.tsx               # Root layout con viewport móvil y fuentes
│   └── page.tsx                 # Orquestador del Dashboard principal
├── components/
│   ├── views/                   # Vistas desacopladas del Dashboard
│   │   ├── HomeView.tsx         # Dashboard principal y saldos
│   │   ├── SendView.tsx         # Flujo SPEI y calculadora FX
│   │   ├── BillsView.tsx        # Pago de servicios y categorías
│   │   ├── TransactionsView.tsx # Historial con filtros y recibos
│   │   └── ProfileView.tsx      # Perfil de usuario y límites de cuenta
│   ├── MexicanBillPayModal.tsx  # Modal de pago de servicios con lector
│   ├── BillCameraScannerModal.tsx # Escáner de código de barras por cámara
│   ├── WhatsAppContactsModal.tsx # Selector de contactos frecuentes
│   ├── BilingualAuthScreen.tsx  # Onboarding y Login bilingüe
│   ├── ClientVaultModal.tsx     # Bóveda Zero-Knowledge
│   └── AppSettingsModal.tsx     # Configuración y soporte
├── domain/
│   └── spei/
│       └── clabeValidator.ts    # Algoritmo Banxico Módulo 10 y directorio bancario
└── lib/
    └── server/
        └── firebase.ts          # Conector Firestore REST API con OAuth2 JWT
```

---

## 4. Matriz de Cumplimiento AML / PLD (Prevención de Lavado de Dinero)

| Nivel KYC | Límite Diario | Límite Mensual | Requisitos Regulatorios |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Básico)** | \$1,000 USD | \$3,000 USD | Teléfono verificado + Nombre completo. |
| **Tier 2 (Verificado)** | \$3,000 USD | \$5,000 USD | Documento oficial (INE o Pasaporte) validado vía Gemini 2.0 OCR. |
| **Tier 3 (Comercial)** | \$10,000 USD | \$25,000 USD | Comprobante de domicilio + RFC/SSN verificado. |

---

## 5. Endpoints y Contratos de API

| Endpoint | Método | Auth | Descripción |
| :--- | :---: | :---: | :--- |
| `/api/auth/login` | `POST` | Pública | Autenticación con email/teléfono y credenciales. |
| `/api/auth/register` | `POST` | Pública | Registro de nuevos usuarios con creación de cuenta Tier 1. |
| `/api/account/data` | `GET` | Sesión | Obtiene perfil, balance disponible y límites del usuario. |
| `/api/spei/transfer` | `POST` | Sesión | Procesa dispersión bancaria SPEI previa validación de saldo y CLABE. |
| `/api/bills/pay` | `POST` | Sesión | Procesa pago de recibos de servicios mexicanos. |
| `/api/kin-cash/send` | `POST` | Sesión | Transferencia P2P inmediata entre usuarios KIN. |
| `/api/kyc/verify` | `POST` | Sesión | Procesa imagen de identificación con Gemini 2.0 y actualiza a Tier 2. |
| `/api/contacts` | `GET/POST` | Sesión | Consulta y guarda contactos frecuentes sincronizados. |

---

## 6. Variables de Entorno Requeridas

```env
# Google Cloud Firestore
FIREBASE_PROJECT_ID=kin-app-prod-b97c0
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./config/firebase-service-account.json
# Para Vercel (producción):
FIREBASE_SERVICE_ACCOUNT_JSON=

# Google Gemini AI (KYC Multimodal)
GEMINI_API_KEY=

# Configuración de Producción
NEXT_TELEMETRY_DISABLED=1
```
