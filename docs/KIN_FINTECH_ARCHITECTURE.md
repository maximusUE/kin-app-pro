# 🏦 KIN Fintech & Remittance Platform — Arquitectura Técnica

Este documento consolida la arquitectura del sistema KIN, su integración con **Google Cloud Firestore (`kin-app-prod-b97c0`)**, el motor algorítmico bancario SPEI y la hoja de ruta para el despliegue a producción.

---

## 1. Visión General
**KIN** es una plataforma móvil y web de servicios financieros transfronterizos diseñada para:
1. **Remesas USA ➔ México:** Envíos de dinero inmediatos con cotización de tipo de cambio FX en tiempo real y dispersión bancaria directa vía SPEI (Banxico).
2. **Pago de Servicios (Bill Pay):** Pago de CFE (luz), Telmex, Izzi, Totalplay, Dish y recargas telefónicas en México desde Estados Unidos.
3. **Transferencias P2P (KIN Cash):** Transferencias entre usuarios de KIN sin comisiones por teléfono o CLABE.
4. **ClientVault:** Bóveda de seguridad con cifrado del lado del cliente, almacenamiento seguro de documentos de identidad y soporte biométrico (FaceID / WebAuthn).

---

## 2. Base de Datos en la Nube: Google Cloud Firestore

* **ID de Proyecto Google Cloud / Firebase:** `kin-app-prod-b97c0`
* **Cuenta de Servicio:** `firebase-adminsdk-fbsvc@kin-app-prod-b97c0.iam.gserviceaccount.com`
* **Credenciales:** Almacenadas en `./config/firebase-service-account.json` (protegidas bajo `.gitignore`).
* **Conector:** Implementación nativa ultrarrápida vía Google Cloud Firestore REST API (`src/lib/server/firebase.ts`), optimizada con autenticación OAuth2 JWT en memoria (<150ms de latencia, cero bloqueos gRPC en macOS/Linux).

### Esquema de Colecciones en Firestore:
```
firestore/
├── users/
│   └── {userId}/                         # Perfil del usuario (ej: user-001, user-1789863039309)
│       ├── firstName, lastName, name
│       ├── email, phone, avatar
│       ├── balanceUSD (balance disponible)
│       ├── kycTier ('Tier 1' | 'Tier 2')
│       ├── dailyLimitUSD, monthlyLimitUSD
│       ├── contacts/                     # Subcolección de contactos frecuentes
│       │   └── {contactId}
│       └── transactions/                 # Subcolección de historial transaccional
│           └── {txId} (SPEI, Bill Pay, KIN Cash)
```

---

## 3. Motor Bancario SPEI & Banxico

* **Algoritmo de Validación CLABE:** Módulo 10 ponderado con pesos `[3, 7, 1]` según la regulación oficial de Banco de México (Banxico).
* **Directorio de Bancos:** Detección automática de institución receptora mediante los primeros 3 dígitos de la CLABE (012 BBVA, 002 Banamex, 014 Santander, 072 Banorte, etc.).
* **Comprobantes Oficiales (CEP Simulado):** Generación automática de Clave de Rastreo Banxico de 30 dígitos alfanuméricos y Folio Fiscal Digital (UUID SAT).

---

## 4. Matriz de Cumplimiento AML / PLD (Prevención de Lavado de Dinero)

* **Tier 1 (Básico):** Límite diario de $1,000 USD. No requiere OCR biométrico avanzado.
* **Tier 2 (Identidad Verificada):** Límite diario de $3,000 USD y mensual de $5,000 USD. Requiere validación de documento oficial (INE o Pasaporte).
* **Tier 3 (Corporativo):** Límite diario de $10,000 USD para operaciones comerciales.

---

## 5. Hoja de Ruta para Despliegue 24/7 (Vercel)

1. Conectar repositorio GitHub `maximusUE/kin-app-pro` en Vercel.
2. Inyectar variables de entorno en Vercel (`FIREBASE_PROJECT_ID`, llaves del service account, `NEXT_TELEMETRY_DISABLED=1`).
3. Generar URL de producción pública HTTPS (`https://kin-app-pro.vercel.app`).
4. (Opcional) Diseñar Landing Page comercial de alta conversión en la ruta raíz `/` y mover el Dashboard a `/app`.
