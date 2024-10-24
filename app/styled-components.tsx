"use client";

import { useEffect } from 'react';
import { useStyledComponentsRegistry } from './hooks/useStyledComponentsRegistry';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [sheet, hydrate] = useStyledComponentsRegistry();

  useEffect(() => {
    if (typeof hydrate === 'function') {
      hydrate();
    }
  }, [hydrate]);

  return (
    <>
      {sheet.getStyleElement()}
      {children}
    </>
  );
}
