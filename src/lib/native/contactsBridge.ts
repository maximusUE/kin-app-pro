/**
 * ============================================================================
 * KIN Native Contacts Bridge (iOS / Android / Web)
 * ============================================================================
 * 
 * GUÍA DE DESPLIEGUE NATIVO (App Store iOS & Google Play):
 * 
 * Cuando se compile KIN como aplicación nativa con Capacitor:
 * 1. Ejecutar en terminal:
 *      npm install @capacitor-community/contacts
 *      npx cap sync
 * 
 * 2. En iOS (ios/App/App/Info.plist):
 *      <key>NSContactsUsageDescription</key>
 *      <string>KIN necesita acceso a tus contactos para autocompletar el nombre y teléfono del destinatario de tus remesas.</string>
 * 
 * 3. En Android (android/app/src/main/AndroidManifest.xml):
 *      <uses-permission android:name="android.permission.READ_CONTACTS" />
 * 
 * Este puente detecta automáticamente el entorno de ejecución:
 * - [NATIVO iOS / ANDROID]: Abre la libreta nativa del teléfono con permiso oficial del sistema.
 * - [WEB CHROME ANDROID]: Utiliza la W3C Contact Picker API nativa del navegador.
 * - [WEB SAFARI IPHONE]: Provee un fallback inteligente para destinatarios guardados y pegado rápido.
 */

export interface DeviceContactResult {
  success: boolean;
  name?: string;
  phone?: string;
  email?: string;
  platform: 'native-capacitor' | 'native-webkit' | 'web-contacts-api' | 'web-fallback';
  error?: string;
}

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
      Plugins?: {
        Contacts?: any;
        [key: string]: any;
      };
    };
    webkit?: {
      messageHandlers?: {
        kinNativeContacts?: {
          postMessage: (data: any) => void;
        };
        [key: string]: any;
      };
    };
  }
}

/**
 * Normaliza un número telefónico extrayendo los últimos 10 dígitos
 * o formateándolo con la clave internacional.
 */
export function normalizePhoneNumber(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

/**
 * Determina si la aplicación se está ejecutando dentro de un contenedor nativo (Capacitor / iOS / Android)
 */
export function isNativePlatform(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Verificación de runtime Capacitor
  if (window.Capacitor?.isNativePlatform && window.Capacitor.isNativePlatform()) {
    return true;
  }
  
  // Verificación de contenedor WebKit (iOS Wrapper dedicado)
  if (window.webkit?.messageHandlers?.kinNativeContacts) {
    return true;
  }

  return false;
}

/**
 * Verifica si el dispositivo actual soporta la selección de contactos por API (Nativo o Web API)
 */
export async function canAccessDeviceContacts(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. En contenedor nativo: Sí soporta
  if (isNativePlatform()) {
    return true;
  }

  // 2. En Android Chrome (W3C Contact Picker API)
  if ('contacts' in navigator && 'ContactsManager' in window) {
    try {
      const supported = await (navigator as any).contacts.getProperties();
      return Array.isArray(supported) && supported.includes('tel');
    } catch (_) {
      return false;
    }
  }

  return false;
}

/**
 * Solicita y abre el selector de contactos del dispositivo.
 * Retorna el contacto seleccionado con nombre y teléfono limpios.
 */
export async function requestDeviceContact(): Promise<DeviceContactResult> {
  if (typeof window === 'undefined') {
    return {
      success: false,
      platform: 'web-fallback',
      error: 'Entorno no disponible en el servidor.',
    };
  }

  // =========================================================================
  // 1. RUTA NATIVA (Capacitor iOS / Android)
  // =========================================================================
  if (isNativePlatform()) {
    try {
      // Intento A: Plugin oficial de Capacitor (@capacitor-community/contacts)
      const capacitorContacts = window.Capacitor?.Plugins?.Contacts;
      if (capacitorContacts) {
        // Solicitar permisos de lectura en iOS / Android
        const permissionStatus = await capacitorContacts.requestPermissions();
        if (permissionStatus?.contacts === 'granted' || permissionStatus?.contacts === 'prompt-with-rationale') {
          // Abrir selector nativo del sistema
          const selection = await capacitorContacts.pickContact({
            projection: {
              name: true,
              phones: true,
              emails: true,
            },
          });

          if (selection && selection.contact) {
            const c = selection.contact;
            const displayName = c.name?.display || `${c.name?.given || ''} ${c.name?.family || ''}`.trim() || 'Contacto';
            const rawPhone = c.phones?.[0]?.number || '';
            const phone = normalizePhoneNumber(rawPhone);
            const email = c.emails?.[0]?.address || '';

            return {
              success: true,
              name: displayName,
              phone,
              email,
              platform: 'native-capacitor',
            };
          }
        }
      }

      // Intento B: Si se usa un puente WebKit directo en iOS
      if (window.webkit?.messageHandlers?.kinNativeContacts) {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve({
              success: false,
              platform: 'native-webkit',
              error: 'Tiempo de espera agotado al abrir contactos nativos.',
            });
          }, 15000);

          (window as any).__onKinContactSelected = (contactData: any) => {
            clearTimeout(timeout);
            delete (window as any).__onKinContactSelected;
            resolve({
              success: true,
              name: contactData?.name || '',
              phone: normalizePhoneNumber(contactData?.phone || ''),
              email: contactData?.email || '',
              platform: 'native-webkit',
            });
          };

          window.webkit!.messageHandlers.kinNativeContacts.postMessage({
            action: 'pickContact',
            callback: '__onKinContactSelected',
          });
        });
      }
    } catch (err: any) {
      console.warn('[KIN Native Contacts] Error al acceder a contactos nativos:', err);
      return {
        success: false,
        platform: 'native-capacitor',
        error: err?.message || 'No se pudo acceder a la libreta nativa.',
      };
    }
  }

  // =========================================================================
  // 2. RUTA WEB CONTACT PICKER API (Android Chrome moderno)
  // =========================================================================
  if ('contacts' in navigator && 'ContactsManager' in window) {
    try {
      const navContacts = (navigator as any).contacts;
      const contacts = await navContacts.select(['name', 'tel'], { multiple: false });

      if (contacts && contacts.length > 0) {
        const contact = contacts[0];
        const rawName = Array.isArray(contact.name) ? contact.name[0] : contact.name;
        const rawPhone = Array.isArray(contact.tel) ? contact.tel[0] : contact.tel;

        return {
          success: true,
          name: rawName || 'Contacto',
          phone: normalizePhoneNumber(rawPhone || ''),
          platform: 'web-contacts-api',
        };
      } else {
        return {
          success: false,
          platform: 'web-contacts-api',
          error: 'Selección cancelada por el usuario.',
        };
      }
    } catch (err: any) {
      // Si el usuario canceló el selector nativo del navegador
      if (err?.name === 'AbortError' || err?.message?.includes('user')) {
        return {
          success: false,
          platform: 'web-contacts-api',
          error: 'Operación cancelada.',
        };
      }
      console.info('[KIN Contacts API] Fallback a selector interno:', err);
    }
  }

  // =========================================================================
  // 3. FALLBACK WEB (Safari iOS / Escritorio)
  // =========================================================================
  return {
    success: false,
    platform: 'web-fallback',
    error: 'La lectura directa de contactos del teléfono estará disponible al 100% en la App Móvil nativa de KIN.',
  };
}
