// app/layout.tsx
import StyledComponentsRegistry from '../styled-components';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default async function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <StyledComponentsRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <div style={{ flex: 1 }}>{children}</div>
            <Footer />
          </NextIntlClientProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
