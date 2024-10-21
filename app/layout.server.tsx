// app/layout.server.tsx
import { Lato } from 'next/font/google';
import { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function ServerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/path/to/your/style.css" />
      </head>
      <body className={`${lato.variable} antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
