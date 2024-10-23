"use client";

import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import ServerLayout from './layout.server';
import { SessionProvider } from 'next-auth/react';


export default function RootLayout({ children }: { children: React.ReactNode }) {



  return (
    <SessionProvider>
        <ServerLayout>{children}</ServerLayout>
    </SessionProvider>
  );
}
