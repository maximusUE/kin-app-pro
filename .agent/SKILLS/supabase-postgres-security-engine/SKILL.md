---
name: supabase-postgres-security-engine
description: "Mejores prácticas oficiales de Supabase & PostgreSQL (2026) para diseño de bases de datos, seguridad estricta con RLS (Row Level Security), indexación de alto rendimiento, concurrencia transaccional y protección criptográfica de APIs. Diseñado para el Backend Engineer."
license: MIT
---

# Supabase & PostgreSQL Backend Security Engine

Este skill codifica las directrices oficiales de ingeniería de Supabase y PostgreSQL para el `Backend_Engineer`. Garantiza que cada migración, tabla, consulta SQL y endpoint de backend se construya con disciplina de seguridad bancaria y alto rendimiento.

---

## 🔒 1. Seguridad Mandatoria & Row Level Security (RLS)

1. **RLS Habilitado por Defecto:**
   Toda tabla en el esquema público (`public`) debe tener RLS activado inmediatamente al crearse:
   ```sql
   ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
   ```
2. **Políticas Restrictivas Explícitas:**
   Nunca dejar una tabla sin políticas activas tras encender RLS (de lo contrario queda bloqueada para todos).
   - Ejemplo de política segura para usuarios autenticados:
     ```sql
     CREATE POLICY "Users can only read their own transactions"
     ON public.transactions
     FOR SELECT
     TO authenticated
     USING (auth.uid() = user_id);
     ```
3. **Vistas con `security_invoker = true`:**
   Al crear vistas sobre tablas con RLS, siempre añadir `WITH (security_invoker = true)` para evitar que la vista eluda los filtros de seguridad del usuario que la consulta:
   ```sql
   CREATE VIEW public.user_dashboard_view
   WITH (security_invoker = true)
   AS SELECT ...;
   ```
4. **Protección de Funciones con `SET search_path = ''`:**
   Toda función de base de datos con `SECURITY DEFINER` debe fijar explícitamente `search_path = ''` para evitar ataques de inyección de esquemas.

---

## ⚡ 2. Rendimiento de Consultas & Estrategia de Índices

1. **Indexación de Llaves Foráneas (Foreign Keys):**
   PostgreSQL no indexa automáticamente las columnas de claves foráneas. Todo campo `*_id` que participe en `JOIN` o filtros frecuentes debe contar con índice B-Tree:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
   ```
2. **Índices Parciales para Filtros Frecuentes:**
   Para tablas grandes con estados finitos (ej. transacciones `pending`, `failed`, `completed`):
   ```sql
   CREATE INDEX IF NOT EXISTS idx_tx_pending
   ON public.transactions(created_at)
   WHERE status = 'pending';
   ```
3. **Optimización con `EXPLAIN (ANALYZE, BUFFERS)`:**
   Antes de aprobar consultas complejas, verificar que el plan ejecute `Index Scan` en lugar de `Seq Scan` (escaneo secuencial de toda la tabla).
4. **Prevención del Problema N+1:**
   En APIs y Server Actions, agrupar lecturas en una sola consulta estructurada (`JOIN` o agregación JSON) en lugar de ejecutar una consulta SQL dentro de un bucle de código.

---

## 🛡️ 3. Transacciones Financieras & Concurrencia

1. **Idempotencia de Pagos (Idempotency Keys):**
   Toda operación financiera (envío de remesa, recarga de saldo, cobro de tarjeta) debe exigir un encabezado `Idempotency-Key` único (UUID v4).
   - Si la clave ya fue procesada en las últimas 24 horas, la API devuelve la respuesta guardada sin duplicar el cargo bancario ni el débito en cuenta.
2. **Bloqueo Pesimista en Actualización de Saldos:**
   Para evitar condiciones de carrera (Race Conditions / Double-Spending), utilizar `SELECT ... FOR UPDATE` al descontar fondos:
   ```sql
   BEGIN;
   SELECT balance_usd FROM public.wallets WHERE user_id = $1 FOR UPDATE;
   -- Validar saldo suficiente
   UPDATE public.wallets SET balance_usd = balance_usd - $2 WHERE user_id = $1;
   COMMIT;
   ```
3. **Transacciones Atómicas Cortas:**
   Mantener las transacciones SQL lo más breves posible. Nunca realizar llamadas HTTP a APIs externas (ej. Stripe, Banxico, Twilio) dentro de un bloque `BEGIN ... COMMIT` de base de datos.

---

## 📡 4. Seguridad de Webhooks y APIs

1. **Verificación de Firmas Criptográficas (HMAC-SHA256):**
   Todo webhook entrante (Stripe, Twilio, proveedores SPEI) debe validar su firma criptográfica en el encabezado (`stripe-signature`, etc.) usando el secreto de producción antes de leer o procesar el cuerpo del mensaje.
2. **Tolerancia de Timestamp (Anti-Replay):**
   Rechazar webhooks con marcas de tiempo con desfase mayor a 5 minutos para prevenir ataques de repetición.
3. **Procesamiento Asíncrono Desacoplado:**
   Responder `200 OK` al proveedor en menos de 2 segundos y encolar el procesamiento pesado en segundo plano.
