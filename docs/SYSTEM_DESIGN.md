# 🏛️ SYSTEM DESIGN & ARQUITECTURA MAESTRA — KIN FINTECH PLATFORM

> **Proyecto:** KIN App (`kin-app-pro`)  
> **Versión del Sistema:** 2.5.0 Production  
> **Repositorio Oficial:** [`maximusUE/kin-app-pro`](https://github.com/maximusUE/kin-app-pro)  
> **URL en Producción:** [https://kin-app-pro.vercel.app](https://kin-app-pro.vercel.app)  
> **Última Actualización:** 10 de Octubre, 2026  

---

## 📚 Índice General de la Suite de Documentación

La documentación técnica de KIN está dividida en 6 manuales modulares especializados:

| Documento | Título y Enfoque | Contenido Principal |
| :--- | :--- | :--- |
| 📖 [**`01_SYSTEM_OVERVIEW.md`**](file:///Users/cesarue/Desktop/Proyecto%20YouTube/docs/01_SYSTEM_OVERVIEW.md) | **Visión General y Arquitectura Global** | Propuesta de valor, misión fintech, topología de capas y roles RBAC. |
| 🏦 [**`02_FINTECH_LOGIC_AND_SPEI.md`**](file:///Users/cesarue/Desktop/Proyecto%20YouTube/docs/02_FINTECH_LOGIC_AND_SPEI.md) | **Lógica Financiera, Rieles SPEI y FX** | Algoritmo CLABE Módulo 10 Banxico, cotización FX, tarifas dinámicas e idempotencia. |
| ⚖️ [**`03_AML_KYC_COMPLIANCE.md`**](file:///Users/cesarue/Desktop/Proyecto%20YouTube/docs/03_AML_KYC_COMPLIANCE.md) | **Cumplimiento AML/PLD y KYC con IA** | Tiers transaccionales 1-3, normativas FinCEN/CNBV y peritaje forense con Gemini 2.0. |
| 📡 [**`04_API_REFERENCE.md`**](file:///Users/cesarue/Desktop/Proyecto%20YouTube/docs/04_API_REFERENCE.md) | **Catálogo y Referencia de la API** | Especificación de los 15 endpoints serverless, payloads JSON y códigos de respuesta. |
| 🎨 [**`05_DESIGN_SYSTEM.md`**](file:///Users/cesarue/Desktop/Proyecto%20YouTube/docs/05_DESIGN_SYSTEM.md) | **Sistema de Diseño y Ergonomía** | Cápsulas ovaladas fijas (Regla Don César), ergonomía táctil y modo claro/oscuro. |
| 🚀 [**`06_DEVOPS_AND_DEPLOYMENT.md`**](file:///Users/cesarue/Desktop/Proyecto%20YouTube/docs/06_DEVOPS_AND_DEPLOYMENT.md) | **Operaciones, DevOps y Despliegue** | Variables de entorno, guía de instalación local, CI/CD en Vercel y rollback. |

---

## 1. Resumen Ejecutivo de la Plataforma

**KIN** es la plataforma de servicios financieros transfronterizos que conecta a la comunidad migrante hispana en los Estados Unidos con sus familiares en México:

1. **Remesas SPEI Directas:** Envíos bancarios instantáneos a cuentas CLABE con tipo de cambio interbancario real (sin comisiones ocultas).
2. **Mexican Bill Pay:** Liquidación directa de servicios básicos en México (CFE, Telmex, Izzi, recargas).
3. **KIN Cash P2P:** Pagos persona a persona entre usuarios con integración de contactos de WhatsApp.
4. **ClientVault:** Bóveda de contraseñas y tarjetas con cifrado del lado del cliente AES-GCM-256 y autenticación biométrica (WebAuthn).

---

## 2. Stack Tecnológico

- **Frontend & App Router:** Next.js 14.2.35 + TypeScript + Tailwind CSS.
- **Serverless Backend:** Next.js API Routes alojadas en Vercel Edge.
- **Base de Datos Cloud:** Google Cloud Firestore (REST API OAuth2) + Supabase PostgreSQL.
- **Inteligencia Artificial:** Google Gemini 2.0 Multimodal (OCR KYC forense).
- **Rieles Bancarios:** Banxico SPEI + Stripe API.
- **Hosting e Infraestructura:** Vercel Global Edge Network.

---

## 3. Matriz Rápida de Límites KYC

| Nivel | Límite Diario | Límite Mensual | Requisito Principal |
| :--- | :---: | :---: | :--- |
| **Tier 1 (Básico)** | \$1,000 USD | \$3,000 USD | Teléfono verificado + Nombre legal |
| **Tier 2 (Verificado)** | \$3,000 USD | \$5,000 USD | Credencial INE o Pasaporte validado con IA |
| **Tier 3 (Comercial)** | \$10,000 USD | \$25,000 USD | Comprobante de domicilio + SSN/RFC |

---

## 4. Guía de Inicio Rápido para Nuevos Ingenieros

```bash
# Clonar el proyecto
git clone https://github.com/maximusUE/kin-app-pro.git
cd kin-app-pro

# Instalar dependencias
npm install

# Correr entorno de desarrollo
npm run dev

# Ejecutar compilación de producción
npm run build
```

Para más detalles, consulte los manuales dedicados listados en la tabla superior.
