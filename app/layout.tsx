"use client";

import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import ServerLayout from './layout.server';
import { SessionProvider } from 'next-auth/react';

const loadMessages = async (locale) => {
  switch (locale) {
    case 'en':
      return (await import('../messages/en.json')).default;
    case 'pl':
      return (await import('../messages/pl.json')).default;
    case 'de':
      return (await import('../messages/de.json')).default;
    default:
      return (await import('../messages/en.json')).default; // Fallback to English
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState({});
  const [locale, setLocale] = useState('en'); // Default locale

  useEffect(() => {
    const currentLocale = window.navigator.language.split('-')[0]; // Get the language code from the browser
    setLocale(currentLocale);
    loadMessages(currentLocale).then(setMessages);
  }, []);

  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ServerLayout>{children}</ServerLayout>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
