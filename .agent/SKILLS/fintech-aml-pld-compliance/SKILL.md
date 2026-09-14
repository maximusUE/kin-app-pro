---
name: fintech-aml-pld-compliance
description: Normativas regulatorias de Prevención de Lavado de Dinero (PLD/AML) CNBV, SAT y FinCEN para remesas transfronterizas USA-México y límites por nivel de cuenta.
---

# Fintech AML & PLD Compliance Skill

Este skill instruye a `security_backend_dev` en el cumplimiento de las regulaciones financieras mexicanas (CNBV/SAT) y estadounidenses (FinCEN) para remesas y transferencias electrónicas.

## 1. Niveles de Cuenta y Límites Transaccionales
| Nivel | Requisitos de Identificación | Límite Mensual (USD) | Límite Diario (USD) |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Básico)** | Nombre, Teléfono validado por SMS, Correo | Hasta $750 USD | $300 USD |
| **Tier 2 (Verificado)** | INE/Pasaporte validado con Gemini OCR + CURP | Hasta $3,000 USD | $1,500 USD |
| **Tier 3 (Avanzado)** | Comprobante de Domicilio (< 3 meses) + RFC | Hasta $10,000+ USD | $5,000 USD |

## 2. Monitoreo y Prevención de Fraude
- **Reporte de Operaciones Relevantes:** Registro inmutable de transacciones que superen los umbrales fijados por la CNBV.
- **Lista de Personas Bloqueadas:** Filtro contra listas negras SAT (Art. 69-B) y OFAC.
