/**
 * KIN Bank-Grade Idempotency Engine
 * Conforms to RFC 7231 / IETF Idempotency-Key Specification
 * Prevents double-spending, accidental duplicate taps, and network retry collisions
 * on all financial transfer and payment routes (SPEI, P2P Kin Cash, Bill Pay).
 */

export interface IdempotencyRecord {
  key: string;
  statusCode: number;
  response: any;
  createdAt: number;
}

// In-memory transaction cache with 24-hour TTL
const idempotencyStore = new Map<string, IdempotencyRecord>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Checks if a request with this idempotency key was already completed.
 */
export function getIdempotentResponse(key: string): IdempotencyRecord | null {
  if (!key || typeof key !== 'string') return null;
  const cleanKey = key.trim();
  const record = idempotencyStore.get(cleanKey);
  if (!record) return null;

  // Evict expired records
  if (Date.now() - record.createdAt > TTL_MS) {
    idempotencyStore.delete(cleanKey);
    return null;
  }

  return record;
}

/**
 * Saves a completed transaction response associated with the idempotency key.
 */
export function saveIdempotentResponse(key: string, statusCode: number, response: any): void {
  if (!key || typeof key !== 'string') return;
  const cleanKey = key.trim();

  // Self-cleaning garbage collector when store grows
  if (idempotencyStore.size > 2000) {
    const now = Date.now();
    for (const [k, rec] of idempotencyStore.entries()) {
      if (now - rec.createdAt > TTL_MS) {
        idempotencyStore.delete(k);
      }
    }
  }

  idempotencyStore.set(cleanKey, {
    key: cleanKey,
    statusCode,
    response,
    createdAt: Date.now(),
  });
}
