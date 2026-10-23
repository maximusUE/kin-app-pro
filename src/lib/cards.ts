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

/**
 * Sync cards vault with API /api/payment-methods and local storage
 */
export async function syncCardsWithApi(userId: string = 'user-001'): Promise<SavedCardItem[]> {
  const localCards = getStoredCards();
  if (typeof window === 'undefined') return localCards;

  try {
    const res = await fetch(`/api/payment-methods?userId=${userId}`);
    if (res.ok) {
      const data = await res.json();
      const apiMethods = data.paymentMethods || data.cards;
      if (Array.isArray(apiMethods) && apiMethods.length > 0) {
        const cardMap = new Map<string, SavedCardItem>();
        apiMethods.forEach((m: any) => {
          const key = m.id || m.last4;
          cardMap.set(key, {
            id: m.id || `card-${m.last4}`,
            name: m.name || 'Tarjeta KIN',
            type: m.type || (m.brand ? m.brand.toUpperCase() : 'Visa'),
            brand: m.brand || 'visa',
            last4: m.last4,
            exp: m.exp,
            isDefault: !!m.isDefault,
            icon: m.icon || 'credit_card',
            tokenId: m.tokenId,
            zip: m.zip,
            country: m.country,
          });
        });

        // Retain local custom cards if not in API list
        localCards.forEach((c) => {
          const key = c.id || c.last4;
          if (!cardMap.has(key)) {
            cardMap.set(key, c);
          }
        });

        const merged = Array.from(cardMap.values());
        saveStoredCards(merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn('[Sync Cards With API Warning]:', err);
  }
  return localCards;
}

/**
 * Tokenize and add a card to both local storage and the /api/payment-methods API
 */
export async function addCardToVault(
  cardData: {
    cardNumber: string;
    exp: string;
    cvv: string;
    cardHolder: string;
    zip?: string;
    country?: string;
    savePermanently?: boolean;
  },
  userId: string = 'user-001'
): Promise<SavedCardItem> {
  const cleanCard = cardData.cardNumber.replace(/\D/g, '');
  const last4 = cleanCard.slice(-4) || '8831';
  let brand: 'visa' | 'mastercard' | 'amex' | 'discover' = 'visa';
  if (cleanCard.startsWith('34') || cleanCard.startsWith('37')) brand = 'amex';
  else if (cleanCard.startsWith('5') || cleanCard.startsWith('2')) brand = 'mastercard';
  else if (cleanCard.startsWith('6')) brand = 'discover';

  const currentCards = getStoredCards();
  const newCard: SavedCardItem = {
    id: `pm_${Date.now()}`,
    name: cardData.cardHolder?.trim() || 'Tarjeta Débito KIN',
    type: brand.toUpperCase(),
    brand: brand,
    last4: last4,
    exp: cardData.exp || '12/28',
    isDefault: currentCards.length === 0,
    icon: 'credit_card',
    zip: cardData.zip || '10451',
    country: cardData.country || 'US',
  };

  const updated = [newCard, ...currentCards];
  saveStoredCards(updated);

  try {
    const res = await fetch('/api/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        cardNumber: cardData.cardNumber,
        exp: cardData.exp,
        cvv: cardData.cvv,
        cardHolder: cardData.cardHolder,
        zip: cardData.zip || '10451',
        country: cardData.country || 'US',
        savePermanently: cardData.savePermanently ?? true,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.paymentMethod?.id) {
        newCard.id = data.paymentMethod.id;
        newCard.tokenId = data.paymentMethod.tokenId;
        const reUpdated = [newCard, ...currentCards];
        saveStoredCards(reUpdated);
      }
    }
  } catch (err) {
    console.warn('[Add Card API Warning]:', err);
  }

  return newCard;
}
