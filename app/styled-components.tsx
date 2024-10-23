// styled-components.tsx
"use client";

import { useEffect } from 'react';
import { useStyledComponentsRegistry } from './hooks/useStyledComponentsRegistry'; // Adjust the path accordingly

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [sheet, hydrate] = useStyledComponentsRegistry();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      {sheet.getStyleElement()}
      {children}
    </>
  );
}
