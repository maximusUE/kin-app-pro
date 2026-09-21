/**
 * Universal Title Case Capitalizer Law for KIN Ecosistema:
 *
 * LEY INVIOLABLE DEL SISTEMA:
 * En todos los campos de texto que representen:
 * - Nombres (First Name, Middle Name, Recipient Name)
 * - Apellidos (Last Names)
 * - Calles y Domicilios (Street, Address)
 * - País (Country)
 * - Estado / Ciudad (State, City, Province)
 *
 * Tanto en Frontend (durante la escritura onChange, autoCapitalize="words" y visualización CSS)
 * como en Backend (validadores, API controllers, sanitizadores y capa de persistencia en base de datos),
 * CADA PALABRA DEBE INICIAR SIEMPRE CON MAYÚSCULA.
 *
 * Soporta caracteres Unicode completos (á, é, í, ó, ú, ñ, ü) y delimitadores habituales
 * como espacios, puntos (Av.), guiones, barras y comas.
 */

export function capitalizeWords(val: string | null | undefined): string {
  if (!val) return '';
  return val.replace(/(^|[\s.,\/-])(\p{L})/gu, (_, separator, letter) => separator + letter.toUpperCase());
}

/**
 * Aplica la ley de mayúsculas a campos específicos de un objeto o registro
 */
export function capitalizeFields<T extends Record<string, any>>(obj: T, fields: (keyof T)[]): T {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  for (const field of fields) {
    if (typeof result[field] === 'string') {
      result[field] = capitalizeWords(result[field] as string) as any;
    }
  }
  return result;
}
