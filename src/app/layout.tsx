import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'KIN — Envíos de Dinero USA a México y Pagos de Servicios',
  description: 'Envía dinero de USA a México al mejor tipo de cambio, paga servicios de CFE, Telmex e Internet, y transfiere P2P con KIN Cash.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KIN',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#121622',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#121622] text-white min-h-[100dvh] antialiased selection:bg-[#2ED5A4]/30 selection:text-[#2ED5A4]">
        {children}
      </body>
    </html>
  );
}
