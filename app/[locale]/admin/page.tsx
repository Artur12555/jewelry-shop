"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const Button = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  margin: 0.5rem 0;
  background-color: white;
  color: black;
  border: 2px solid black;
  text-align: center;
  text-decoration: none;
  font-size: 1.25rem;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const AdminDashboard = () => {
  const [locale, setLocale] = useState<string>('en');
  const t = useTranslations('admin');

  useEffect(() => {
    const storedLocale = localStorage.getItem('language') || 'en';
    setLocale(storedLocale);
  }, []);

  return (
    <Container>
      <Title>{t('title')}</Title>
      <Nav>
        <Button as={Link} href={`/${locale}/admin/users`}>
        {t('users')}
        </Button>
        <Button as={Link} href={`/${locale}/admin/orders`}>
        {t('orders')}
        </Button>
        <Button as={Link} href={`/${locale}/admin/manageproducts`}>
        {t('products')}
        </Button>
      </Nav>
    </Container>
  );
};

export default AdminDashboard;
