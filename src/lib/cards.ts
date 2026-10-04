export interface SavedCardItem {
  id: string;
  name: string;
  type: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'bank' | 'apple-pay' | 'cash-app';
  last4: string;
  exp: string;
  isDefault: boolean;
  icon: string;
  tokenId?: string;
  zip?: string;
  country?: string;
}

export const INITIAL_SAVED_CARDS: SavedCardItem[] = [
  {
    id: 'card-1',
    name: 'Obsidian Metal Debit',
    type: 'Visa',
    brand: 'visa',
    last4: '8942',
    exp: '09/28',
    isDefault: true,
    icon: 'credit_card',
    zip: '10451',
    country: 'US',
  },
  {
    id: 'card-2',
    name: 'Titanium Freedom Credit',
    type: 'Mastercard',
    brand: 'mastercard',
    last4: '4022',
    exp: '11/27',
    isDefault: false,
    icon: 'credit_card',
    zip: '90210',
    country: 'US',
  },
];

const STORAGE_KEY = 'kin_saved_cards_vault_v2';

export function getStoredCards(): SavedCardItem[] {
  if (typeof window === 'undefined') return INITIAL_SAVED_CARDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SAVED_CARDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAVED_CARDS;
  } catch {
    return INITIAL_SAVED_CARDS;
  }
}

export function saveStoredCards(cards: SavedCardItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.warn('[Cards Vault Storage Error]:', err);
  }
}
