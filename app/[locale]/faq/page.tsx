// pages/faq.js

"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

const FAQ = () => {
  const t = useTranslations('FAQ');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>
        <h2>{t('question1.title')}</h2>
        <p>{t('question1.answer')}</p>
      </div>
      <div>
        <h2>{t('question2.title')}</h2>
        <p>{t('question2.answer')}</p>
      </div>
    </div>
  );
};

export default FAQ;
