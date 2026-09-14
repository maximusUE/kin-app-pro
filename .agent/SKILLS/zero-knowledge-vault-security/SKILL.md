---
name: zero-knowledge-vault-security
description: Arquitectura de seguridad bancaria Zero-Knowledge para ClientVault con cifrado del lado del cliente AES-GCM-256 y autenticación biométrica WebAuthn.
---

# Zero-Knowledge Vault Security Skill

Este skill es la guía técnica mandatoria para `security_backend_dev` para la protección y almacenamiento de documentos confidenciales (INE, comprobantes, pasaportes, recibos de remesas).

## 1. Principio Zero-Knowledge
- El servidor y la base de datos (Supabase) **nunca tienen acceso al contenido sin cifrar** de los documentos ni a las llaves privadas del usuario.
- El cifrado y descifrado se realizan exclusivamente en el dispositivo del usuario utilizando la Web Crypto API nativa (`crypto.subtle`).

## 2. Parámetros de Cifrado Estándar
- **Algoritmo:** AES-GCM (Galois/Counter Mode).
- **Longitud de Llave:** 256 bits.
- **Vector de Inicialización (IV):** 96 bits (12 bytes) aleatorios criptográficos por cada operación de cifrado (`crypto.getRandomValues`).
- **Derivación de Llave:** PBKDF2 con HMAC-SHA-256 y mínimo 100,000 iteraciones con Salt aleatorio de 16 bytes.

## 3. Autenticación Biométrica (Passkeys / Face ID)
- Integración de WebAuthn / Passkeys para desbloquear la llave maestra del ClientVault sin necesidad de teclear contraseñas maestras repetidamente.
