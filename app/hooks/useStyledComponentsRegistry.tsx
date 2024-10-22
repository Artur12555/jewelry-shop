// hooks/useStyledComponentsRegistry.tsx
"use client";

import { useEffect, useState } from 'react';
import { ServerStyleSheet } from 'styled-components';

export function useStyledComponentsRegistry() {
  const [sheet] = useState(() => new ServerStyleSheet());

  const hydrate = () => {
    if (typeof window !== 'undefined') {
      const styles = document.querySelectorAll('style[data-styled]');
      styles.forEach((style) => {
        sheet.collectStyles(style);
      });
    }
  };

  return [sheet, hydrate];
}
