"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const OuterContainer = styled.div`
  width: 100%;
  display: flex;
  background-color: black;
  justify-content: center;
`;

const FooterContainer = styled.div`
  background-color: black;
  color: white;
  width: 40%;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Column = styled.div`
  flex: 1;
  min-width: 244px;
  padding: 10px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const ColumnHeader = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  @media (min-width: 769px) {
    cursor: default;
  }
`;

const ChevronWrapper = styled.span`
  margin-left: auto;
  display: block;

  @media (min-width: 769px) {
    display: none; /* Hide chevrons on desktop */
  }
`;

const ColumnItem = styled.span<{ show?: boolean }>`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: gray;
  margin-bottom: 5px;
  padding-left: 20px;
  transition: transform 0.3s ease, color 0.3s ease;
  display: ${({ show }) => (show ? 'block' : 'none')};

  &:hover {
    transform: scale(1.1);
    color: white;
  }

  @media (min-width: 768px) {
    display: block; /* Always show on larger screens */
  }
`;

const CopyrightContainer = styled.div`
  background-color: #111;
  color: white;
  width: 100%;
  padding: 10px 0;
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
`;

interface ExpandedColumns {
  [key: string]: boolean;
}

const Footer = () => {
  const t = useTranslations('Footer');
  const [expandedColumns, setExpandedColumns] = useState<ExpandedColumns>({});

  const toggleColumn = (column: string) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <>
      <OuterContainer>
        <FooterContainer>
          <Column>
            <ColumnHeader onClick={() => toggleColumn('help')}>
              {t('help')}
              <ChevronWrapper>
                {expandedColumns['help'] ? <FaChevronUp /> : <FaChevronDown />}
              </ChevronWrapper>
            </ColumnHeader>
            <ColumnItem show={expandedColumns['help']}>{t('contact')}</ColumnItem>
            <ColumnItem show={expandedColumns['help']}>{t('faq')}</ColumnItem>
            <ColumnItem show={expandedColumns['help']}>{t('cookies')}</ColumnItem>
            <ColumnItem show={expandedColumns['help']}>{t('terms')}</ColumnItem>
            <ColumnItem show={expandedColumns['help']}>{t('privacy')}</ColumnItem>
            <ColumnItem show={expandedColumns['help']}>{t('paymentsDelivery')}</ColumnItem>
          </Column>
          <Column>
            <ColumnHeader onClick={() => toggleColumn('paymentMethods')}>
              {t('paymentMethods')}
              <ChevronWrapper>
                {expandedColumns['paymentMethods'] ? <FaChevronUp /> : <FaChevronDown />}
              </ChevronWrapper>
            </ColumnHeader>
            <ColumnItem show={expandedColumns['paymentMethods']}>{t('personalizedOrders')}</ColumnItem>
            <ColumnItem show={expandedColumns['paymentMethods']}>{t('deliveryCosts')}</ColumnItem>
            <ColumnItem show={expandedColumns['paymentMethods']}>{t('orderProcessing')}</ColumnItem>
          </Column>
          <Column>
            <ColumnHeader onClick={() => toggleColumn('customerSupport')}>
              {t('customerSupport')}
              <ChevronWrapper>
                {expandedColumns['customerSupport'] ? <FaChevronUp /> : <FaChevronDown />}
              </ChevronWrapper>
            </ColumnHeader>
            <ColumnItem show={expandedColumns['customerSupport']}>{t('returns')}</ColumnItem>
            <ColumnItem show={expandedColumns['customerSupport']}>{t('complaints')}</ColumnItem>
            <ColumnItem show={expandedColumns['customerSupport']}>{t('authenticityGuarantee')}</ColumnItem>
          </Column>
        </FooterContainer>
      </OuterContainer>
      <CopyrightContainer>
        &copy; {new Date().getFullYear()} {t('copyright')}.
      </CopyrightContainer>
    </>
  );
};

export default Footer;
