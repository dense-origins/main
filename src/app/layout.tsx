import type { Metadata } from 'next';
import { Noto_Serif, Work_Sans } from 'next/font/google';
import './globals.css';

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-d',
  display: 'swap',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-b',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Dense Origins — Premium B2B Exporter of Natural Raw Ingredients from India',
    template: '%s | Dense Origins',
  },
  description:
    'Dense Origins exports premium natural and raw Indian ingredients — Fuller\'s Earth, Psyllium Husk, Raisins, Almonds, and Cashews — for B2B buyers worldwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${workSans.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
