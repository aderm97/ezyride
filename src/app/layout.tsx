import type { Metadata } from 'next';
import { Cormorant, Montserrat } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant({ 
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ezyride | Move Smarter, Earn Freely',
  description: 'The state-of-the-art e-hailing platform for riders and drivers. Secure, fast, and reliable rides at your fingertips.',
  keywords: ['ride hailing', 'e-hailing', 'book a ride', 'driver signup', 'ride sharing', 'Ezyride'],
  openGraph: {
    title: 'Ezyride | Move Smarter, Earn Freely',
    description: 'The state-of-the-art e-hailing platform for riders and drivers. Secure, fast, and reliable rides at your fingertips.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ezyride',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eazyride | Move Smarter. Earn Freely.',
    description: 'Book rides instantly or start earning on your own schedule.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Providers } from '@/components/Providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${cormorant.variable} ${montserrat.variable} bg-background text-text-primary antialiased selection:bg-cta/30 selection:text-cta`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
