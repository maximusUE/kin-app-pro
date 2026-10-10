# 🏦 Lógica Financiera, Rieles SPEI y Cotización FX (02_FINTECH_LOGIC_AND_SPEI)

> **Documento:** 02_FINTECH_LOGIC_AND_SPEI.md  
> **Módulo:** Core Bancario y Transfronterizo  
> **Código de Referencia:** [`clabeValidator.ts`](file:///Users/cesarue/Desktop/Proyecto%20YouTube/src/domain/spei/clabeValidator.ts), [`idempotency.ts`](file:///Users/cesarue/Desktop/Proyecto%20YouTube/src/lib/server/idempotency.ts), [`spei/transfer/route.ts`](file:///Users/cesarue/Desktop/Proyecto%20YouTube/src/app/api/spei/transfer/route.ts)  

---

## 1. 🇲🇽 Riel SPEI Banxico (Sistema de Pagos Electrónicos Interbancarios)

El sistema **SPEI** es la infraestructura operada por el **Banco de México (Banxico)** que liquida pagos electrónicos en pesos mexicanos (MXN) en tiempo real entre cuentas bancarias.

En KIN, cualquier transferencia enviada desde EE.UU. hacia México se liquida directamente a una **CLABE Interbancaria (Clave Bancaria Estandarizada)** de 18 dígitos.

### Estructura Oficial de la CLABE de 18 Dígitos

| Posición | Longitud | Significado | Ejemplo (`012180015678901234`) |
| :---: | :---: | :--- | :--- |
| **1 - 3** | 3 dígitos | **Código de la Institución Bancaria** asignado por Banxico | `012` = BBVA México |
| **4 - 6** | 3 dígitos | **Código de Plaza o Sucursal** bancaria | `180` = Ciudad de México / Plaza |
| **7 - 17** | 11 dígitos | **Número de Cuenta** del cliente beneficiario | `01567890123` |
| **18** | 1 dígito | **Dígito Verificador (Control de Integridad)** | `4` (calculado matemáticamente) |

---

## 2. 🧮 Algoritmo del Dígito Verificador (Módulo 10 Ponderado de Banxico)

Para evitar que un usuario envíe dinero por error a una cuenta inexistente por teclear mal un número, el frontend y el backend de KIN ejecutan de forma síncrona el algoritmo criptográfico oficial de Banxico antes de permitir cualquier envío:

### Vector de Ponderación Oficial:
```typescript
const factores = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
```

### Pasos del Algoritmo:
1. Se toman los primeros 17 dígitos de la CLABE.
2. Cada dígito $i$ se multiplica por el factor correspondiente $factores[i]$.
3. De cada multiplicación, se toma únicamente el residuo módulo 10:  
   $$\text{producto}_i = (d_i \times factores[i]) \pmod{10}$$
4. Se suman todos los productos:  
   $$\text{suma} = \sum_{i=0}^{16} \text{producto}_i$$
5. El dígito verificador calculado es:  
   $$\text{DV} = (10 - (\text{suma} \pmod{10})) \pmod{10}$$
6. **Validación:** Si $\text{DV} == d_{17}$ (el dígito número 18), la cuenta es **100% auténtica y matemáticamente válida**. Si no coincide, se rechaza inmediatamente la transacción.

### Directorio de Instituciones Financieras Soportadas en KIN:
- `002`: Citibanamex (Banamex)
- `012`: BBVA México
- `014`: Banco Santander México
- `021`: HSBC México
- `072`: Banorte (Banco Mercantil del Norte)
- `127` / `646`: STP (Sistema de Transferencias y Pagos - Fintechs)
- `137`: BanCoppel
- `138`: Nu México Financiera
- `166`: Banco del Bienestar
- `659`: Spin by OXXO (OXXO Pay)
- `670`: Mercado Pago Wallet México
- `706`: Albo
- `710`: Klar

---

## 3. 💱 Motor de Cotización FX y Transparencia Financiera

### Tasa Interbancaria en Tiempo Real
- KIN obtiene el tipo de cambio oficial de mercado (ej. `1 USD = 20.45 MXN`).
- **Política de Cero Sobreprecio (*No Markup*):** Mientras que los bancos cobran hasta \$1.50 MXN menos por dólar a escondidas, KIN entrega la tasa interbancaria limpia.

### Fórmula de Tarifa de Transacción Dinámica (*Transaction Fee Formula*):
La comisión por envío en KIN se calcula en escalones justos para el usuario:

| Rango de Envío (USD) | Comisión Fija (USD) | Tasa Efectiva Máxima |
| :---: | :---: | :---: |
| **Primer Envío del Usuario** | **\$0.00 USD** | **0.00% (Promoción de Bienvenida)** |
| **\$1.00 a \$50.00 USD** | **\$0.99 USD** | ~1.98% |
| **\$50.01 a \$200.00 USD** | **\$1.99 USD** | ~0.99% |
| **\$200.01 a \$500.00 USD** | **\$2.99 USD** | ~0.59% |
| **\$500.01 en adelante** | **\$3.99 USD** | < 0.40% |

### Cálculo del Total a Pagar y Monto Entregado:
$$\text{Total Debitado de la Billetera USD} = \text{Monto Enviado USD} + \text{Transaction Fee}$$
$$\text{Monto Recibido en México (MXN)} = \text{Monto Enviado USD} \times \text{Tasa FX USD/MXN}$$

---

## 4. 🛡️ Motor de Idempotencia Bancaria (Prevención de Doble Cargo)

Para evitar duplicidad de cobros si un cliente presiona dos veces el botón de enviar o si la conexión móvil falla a medio camino:

1. El cliente genera un encabezado único:
   ```http
   Idempotency-Key: uuid-v4-generado-en-el-cliente
   ```
2. El servidor ([`idempotency.ts`](file:///Users/cesarue/Desktop/Proyecto%20YouTube/src/lib/server/idempotency.ts)) verifica en memoria y caché si esa llave ya fue procesada en las últimas 24 horas.
3. Si la llave ya existe: **no vuelve a debitar el saldo**; en su lugar, devuelve de inmediato la respuesta del primer intento con el comprobante ya generado.
4. Si la llave es nueva: procesa la dispersión, guarda el resultado en el historial y registra la transacción en la bitácora de auditoría.
