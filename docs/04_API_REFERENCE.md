# 📡 Catálogo y Referencia de la API Serverless (04_API_REFERENCE)

> **Documento:** 04_API_REFERENCE.md  
> **Servidor:** Next.js Serverless Edge & Node.js Runtime  
> **Base URL (Producción):** `https://kin-app-pro.vercel.app`  
> **Protocolo:** HTTPS / JSON REST  

---

## 1. 🔐 Estándares y Encabezados Globales

Todas las solicitudes que modifiquen estado financiero deben incluir:

| Encabezado | Valor / Formato | Obligatorio | Descripción |
| :--- | :--- | :---: | :--- |
| `Content-Type` | `application/json` | Sí | Formato estándar de envío. |
| `Idempotency-Key` | `UUID v4` (ej. `a1b2c3d4-...`) | Sí (en pagos) | Evita duplicidad de cargos o retiros en reintentos. |
| `Authorization` | `Bearer <token>` o cookie de sesión | Sí (en rutas privadas) | Valida la sesión del usuario autenticado. |

---

## 2. 📋 Catálogo Completo de Endpoints

### 2.1 Autenticación y Cuentas

#### `POST /api/auth/login`
Autentica a un usuario existente mediante correo electrónico o teléfono y contraseña.
- **Request:**
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "Password123!"
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "success": true,
    "user": {
      "id": "usr_99812",
      "name": "César Urrutia",
      "email": "usuario@ejemplo.com",
      "kycTier": "Tier 1",
      "balanceUSD": 1250.00
    }
  }
  ```

#### `POST /api/auth/register`
Registra un nuevo usuario en la plataforma con nivel KYC Tier 1.
- **Request:**
  ```json
  {
    "firstName": "César",
    "lastName": "Urrutia",
    "email": "usuario@ejemplo.com",
    "phone": "+1 (555) 234-5678",
    "password": "Password123!"
  }
  ```

#### `GET /api/account/data`
Obtiene los datos completos del perfil, límites transaccionales diarios/mensuales y saldo disponible.
- **Response 200 OK:**
  ```json
  {
    "id": "usr_99812",
    "name": "César Urrutia",
    "balanceUSD": 1250.00,
    "kycTier": "Tier 2",
    "dailyLimitUSD": 3000,
    "monthlyLimitUSD": 5000,
    "transactions": [...]
  }
  ```

---

### 2.2 Remesas Transfronterizas (SPEI Banxico)

#### `POST /api/spei/transfer`
Ejecuta una dispersión bancaria directa en México hacia una cuenta CLABE de 18 dígitos.
- **Headers Requeridos:** `Idempotency-Key: uuid-v4`
- **Request:**
  ```json
  {
    "recipientName": "María González",
    "recipientClabe": "012180015678901234",
    "amountUSD": 200.00,
    "feeUSD": 1.99,
    "rateFX": 20.45,
    "conceptNote": "Apoyo familiar quincenal"
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "success": true,
    "transactionId": "spei_tx_889102",
    "trackingKeyBanxico": "KIN2026101000192837",
    "amountDeliveredMXN": 4090.00,
    "status": "COMPLETED",
    "newBalanceUSD": 1048.01,
    "timestamp": "2026-10-10T08:35:00Z"
  }
  ```
- **Error 400 Bad Request:**
  ```json
  {
    "success": false,
    "error": "La CLABE debe tener 18 dígitos y dígito verificador válido de Banxico"
  }
  ```

---

### 2.3 Cotización de Divisas (FX)

#### `GET /api/fx`
Obtiene la tasa de cambio interbancaria en tiempo real USD a MXN.
- **Response 200 OK:**
  ```json
  {
    "pair": "USD/MXN",
    "rate": 20.45,
    "spread": 0.00,
    "provider": "BANXICO_INTERBANK",
    "updatedAt": "2026-10-10T08:30:00Z"
  }
  ```

---

### 2.4 Pago de Servicios Mexicanos (Bill Pay)

#### `POST /api/bills/pay`
Liquida un recibo de servicios (CFE, Telmex, etc.) debitando del saldo USD.
- **Request:**
  ```json
  {
    "serviceId": "cfe_luz",
    "serviceName": "CFE Suministrador de Servicios Básicos",
    "barcodeReference": "01234567890123456789",
    "amountMXN": 845.50,
    "amountUSD": 41.34,
    "convenienceFeeUSD": 1.25
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "success": true,
    "folioAutorizacion": "CFE-AUTH-991823",
    "status": "PAID",
    "fechaAplicacion": "2026-10-10"
  }
  ```

---

### 2.5 Transferencias P2P (KIN Cash)

#### `POST /api/kin-cash/send`
Envío inmediato de saldo USD entre miembros registrados en KIN.
- **Request:**
  ```json
  {
    "recipientPhone": "+15559876543",
    "amountUSD": 50.00,
    "note": "Pago almuerzo"
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "success": true,
    "transferId": "p2p_44819",
    "feeUSD": 0.00,
    "status": "DELIVERED_INSTANT"
  }
  ```

---

### 2.6 Verificación de Identidad con Inteligencia Artificial

#### `POST /api/kyc/verify`
Procesa la imagen de una identificación oficial mexicana (INE/Pasaporte) mediante Google Gemini 2.0.
- **Request:**
  ```json
  {
    "userId": "usr_99812",
    "docType": "INE",
    "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "success": true,
    "data": {
      "tipo_documento": "INE",
      "datos_personales": {
        "nombres": "César",
        "primer_apellido": "Urrutia",
        "curp": "URRE880914HDFRLS03"
      },
      "seguridad_forense": {
        "score_legibilidad": 0.98,
        "es_fotocopia": false,
        "es_pantalla": false,
        "esquinas_completas": true
      },
      "nuevo_tier": "Tier 2 (Identidad Oficial Verificada)"
    }
  }
  ```

---

### 2.7 Libreta de Contactos Frecuentes

#### `GET /api/contacts` / `POST /api/contacts`
Administra la lista de destinatarios frecuentes para envío rápido.
- **Campos:** `id`, `name`, `phone`, `clabe`, `bank`, `avatar`, `favorite`.
