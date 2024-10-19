"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
  min-width: 150px; 
  padding: 10px;
  display: flex;
  flex-direction: column;
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

const ColumnItem = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem; 
  color: gray;
  margin-bottom: 5px;
  padding-left: 20px;

  @media (max-width: 768px) {
    display: ${({ show }) => (show ? 'block' : 'none')};
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

const Footer = () => {
  const [expandedColumns, setExpandedColumns] = useState({});

  const toggleColumn = (column) => {
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
            <ColumnHeader onClick={() => toggleColumn('pomoc')}>
              Pomoc 
              <span style={{ marginLeft: 'auto', display: 'none', '@media (max-width: 768px)': { display: 'block' } }}>
                {expandedColumns['pomoc'] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </ColumnHeader>
            <ColumnItem show={expandedColumns['pomoc']}>Kontakt</ColumnItem>
            <ColumnItem show={expandedColumns['pomoc']}>FAQ</ColumnItem>
            <ColumnItem show={expandedColumns['pomoc']}>Zarządaj plikami cookies</ColumnItem>
            <ColumnItem show={expandedColumns['pomoc']}>Regulamin</ColumnItem>
            <ColumnItem show={expandedColumns['pomoc']}>Polityka prywatności</ColumnItem>
            <ColumnItem show={expandedColumns['pomoc']}>Płatności i Dostawa</ColumnItem>
          </Column>
          <Column>
            <ColumnHeader onClick={() => toggleColumn('sposobyPlatnosci')}>
              Sposoby płatności 
              <span style={{ marginLeft: 'auto', display: 'none', '@media (max-width: 768px)': { display: 'block' } }}>
                {expandedColumns['sposobyPlatnosci'] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </ColumnHeader>
            <ColumnItem show={expandedColumns['sposobyPlatnosci']}>Zamówienia Personalizowane</ColumnItem>
            <ColumnItem show={expandedColumns['sposobyPlatnosci']}>Koszty i formy dostawy</ColumnItem>
            <ColumnItem show={expandedColumns['sposobyPlatnosci']}>Czas realizacji zamówień</ColumnItem>
          </Column>
          <Column>
            <ColumnHeader onClick={() => toggleColumn('obslugaKlienta')}>
              Obsługa Klienta 
              <span style={{ marginLeft: 'auto', display: 'none', '@media (max-width: 768px)': { display: 'block' } }}>
                {expandedColumns['obslugaKlienta'] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </ColumnHeader>
            <ColumnItem show={expandedColumns['obslugaKlienta']}>Zwroty</ColumnItem>
            <ColumnItem show={expandedColumns['obslugaKlienta']}>Reklamacje</ColumnItem>
            <ColumnItem show={expandedColumns['obslugaKlienta']}>Gwarancja autentyczności produktów</ColumnItem>
          </Column>
        </FooterContainer>
      </OuterContainer>
      <CopyrightContainer>
        &copy; {new Date().getFullYear()} by Your Company Name. Created by Your Name.
      </CopyrightContainer>
    </>
  );
};

export default Footer;
