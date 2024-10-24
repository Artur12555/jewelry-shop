
import StyledComponentsRegistry from '../styled-components';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale?: string; // Optional locale property
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = params.locale || 'en'; // Fallback to 'en' if locale is not provided
  const messages = await getMessages({ locale }); // Pass an object with locale property

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
