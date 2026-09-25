import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import RouteTransitionProvider from '@/components/providers/RouteTransitionProvider';
import GsapScrollTriggerProvider from '@/components/providers/GsapScrollTriggerProvider';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'APEX MEDIA CO — High-Impact Brand Collateral & Merchandise',
  description: 'National creative and marketing agency storefront selling precision-engineered branded merchandise, executive apparel kits, keynote event signage, and digital brand systems.',
  keywords: ['APEX MEDIA CO', 'Agency Swag', 'Brand Collateral', 'Executive Apparel', 'Keynote Signage', 'VIP Kits', 'Digital Systems'],
  authors: [{ name: 'APEX Creative Engineering' }],
  metadataBase: new URL('https://apexmediaco.agency'),
  openGraph: {
    title: 'APEX MEDIA CO — High-Impact Brand Collateral & Merchandise',
    description: 'Precision-engineered merchandise, keynote event systems, and branded physical kits for enterprise clients.',
    url: 'https://apexmediaco.agency',
    siteName: 'APEX MEDIA CO',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'APEX MEDIA CO — Brand Commerce Platform',
    description: 'Portfolio-grade agency merchandise & collateral kits for national campaigns.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} dark antialiased`}>
      <body className="bg-[#0A0A0C] text-[#F5F5F8] min-h-screen flex flex-col font-sans selection:bg-[#2D68FF]/30 selection:text-white">
        <SmoothScrollProvider>
          <GsapScrollTriggerProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 w-full flex flex-col">
                <RouteTransitionProvider>
                  {children}
                </RouteTransitionProvider>
              </main>
              <CartDrawer />
              <Footer />
            </CartProvider>
          </GsapScrollTriggerProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
