---
name: spei-banxico-fintech-engine
description: Reglas y algoritmos de validación de rieles de pago SPEI Banxico, CLABE interbancaria (módulo 10 ponderado) y cotización FX USD/MXN en tiempo real.
---

# SPEI Banxico Fintech Engine Skill

Este skill es la guía técnica mandatoria para `security_backend_dev` para la gestión de transferencias interbancarias y pagos en México.

## 1. Algoritmo Oficial de Validación CLABE (18 dígitos)
Toda CLABE interbancaria mexicana consta de 18 dígitos:
- **Dígitos 1 a 3:** Código de la Institución Bancaria (ej. `002` Banamex, `012` BBVA, `014` Santander, `072` Banorte, `127` STP, `138` Nu México, `646` STP).
- **Dígitos 4 a 6:** Código de Plaza / Ciudad.
- **Dígitos 7 a 17:** Número de Cuenta del Beneficiario.
- **Dígito 18:** Dígito de Control Verificador (calculado con ponderación 3-7-1 módulo 10).

### Implementación Matemática en TypeScript:
```typescript
export function validarCLABE(clabe: string): { valida: boolean; banco?: string; error?: string } {
  if (!/^\d{18}$/.test(clabe)) {
    return { valida: false, error: "La CLABE debe contener exactamente 18 dígitos numéricos" };
  }

  const factores = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  let suma = 0;

  for (let i = 0; i < 17; i++) {
    const producto = (parseInt(clabe[i], 10) * factores[i]) % 10;
    suma += producto;
  }

  const digitoCalculado = (10 - (suma % 10)) % 10;
  const digitoReal = parseInt(clabe[17], 10);

  if (digitoCalculado !== digitoReal) {
    return { valida: false, error: "El dígito verificador de la CLABE es inválido" };
  }

  return { valida: true };
}
```

## 2. Rieles de Teléfono Dimo & CoDi
- Soporte para transferencias SPEI asociadas a números celulares de 10 dígitos (Dimo).
- Generación de códigos QR compatibles con el estándar Banxico CoDi.
