import { Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  title: 'VastraLuxe - Designer Indian Wear',
  description:
    'Premium full-stack eCommerce experience for lehenga, saree, sherwani, kurta and kids traditional wear.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'VastraLuxe - Designer Indian Wear',
    description: 'Luxury Indian fashion collections for women, men and kids.',
    type: 'website',
    url: 'http://localhost:3000',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${manrope.variable}`}>
        <Providers>
          <div className="min-h-screen">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
