"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FaShoppingBasket, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const OuterContainer = styled.div`
  background-color: black;
  color: white;
  width: 100%;
  font-weight: 300;
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  background-color: black;
  height: 150px;
  margin: 0 auto;
  padding: 1rem;
  color: white;
  font-family: 'Lato', sans-serif;

  @media (max-width: 768px) {
    height: auto;
    flex-direction: column;
  }
`;

const Logo = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  text-align: left;
`;

const ContactInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Lato', sans-serif;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Separator = styled.span`
  margin: 0 10px;
  border-left: 1px solid white;
  height: 20px;
`;

const IconsContainer = styled.div`
  flex: 1;
  text-align: right;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;

  @media (max-width: 768px) {
    justify-content: flex-end;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-family: 'Lato', sans-serif;

  span {
    width: 100%;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  margin-right: 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LanguageDisplay = styled.div`
  background-color: black;
  border: 1px solid transparent;
  color: white;
  padding: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: black;
  border: 1px solid white;
  width: 120px;
  z-index: 1000;
  display: ${({ open }) => (open ? 'block' : 'none')};
`;

const DropdownItem = styled.div`
  padding: 10px;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(240, 240, 240, 0.5);
  }
`;

const CheckIcon = styled(FaCheck)`
  color: white;
  margin-left: auto;
`;

const languageMap = {
  pl: "Polski",
  en: "English",
  de: "Deutsch"
};

const CategoryBar = styled.div`
  background-color: white;
  color: black;
  padding: 10px 0;
  font-family: 'Playfair Display', serif;
  display: flex;
  justify-content: center;
  gap: 70px;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const HamburgerLine = styled.div`
  width: 30px;
  height: 3px;
  background-color: white;
  margin: 4px 0;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  height: 100vh;
  width: 250px;
  z-index: 100;
  padding-top: 60px;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  color: white;
`;

const CategoryLink = styled.span`
  display: block;
  padding: 10px 20px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: rgba(240, 240, 240, 0.5);
  }
`;

const LanguageSelectorContainer = styled.div`
  padding: 20px;
  color: white;
`;

const Navbar = () => {
  const t = useTranslations('HomePage');
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedLocale = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;

    if (savedLocale) {
      setSelectedLocale(savedLocale);
      if (savedLocale !== router.locale) {
        router.push(window.location.pathname.replace(/^\/[a-z]{2}/, `/${savedLocale}`));
      }
    } else {
      const defaultLocale = router.locale || 'en';
      setSelectedLocale(defaultLocale);
    }
  }, [router]);

  const handleLanguageChange = (locale) => {
    localStorage.setItem('locale', locale);
    const currentPath = window.location.pathname;
    const newPath = `/${locale}${currentPath.replace(/^\/[a-z]{2}/, '')}`;
    router.push(newPath);
    setSelectedLocale(locale);
    setDropdownOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <OuterContainer>
      <NavbarContainer>
        <ContactInfo>
          <span>kontakt@awgems.pl</span>
          <Separator />
          <span>+48 123 456 789</span>
        </ContactInfo>
        <Logo>
          <Image 
            src="/images/site_banner_logo.png" 
            alt="Site Banner Logo" 
            width={250} 
            height={100} 
          />
        </Logo>
        <IconsContainer>
          <IconWrapper>
            <DropdownContainer>
              <LanguageDisplay onClick={() => setDropdownOpen(!dropdownOpen)}>
                {languageMap[selectedLocale] || selectedLocale.toUpperCase()}
              </LanguageDisplay>
              <DropdownMenu open={dropdownOpen}>
                {Object.keys(languageMap).map((locale) => (
                  <DropdownItem key={locale} onClick={() => handleLanguageChange(locale)}>
                    {languageMap[locale]}
                    {selectedLocale === locale && <CheckIcon />}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </DropdownContainer>
          </IconWrapper>
          <IconWrapper>
            <FaSearch size={30} />
          </IconWrapper>
          <IconWrapper>
            <FaShoppingBasket size={30} />
          </IconWrapper>
          <Hamburger onClick={toggleSidebar}>
            <HamburgerLine />
            <HamburgerLine />
            <HamburgerLine />
          </Hamburger>
        </IconsContainer>
      </NavbarContainer>
      <CategoryBar>
        <span>{t('categories.necklaces')}</span>
        <span>{t('categories.rings')}</span>
        <span>{t('categories.bracelets')}</span>
        <span>{t('categories.earrings')}</span>
        <span>{t('categories.gemstones')}</span>
      </CategoryBar>
      <Sidebar isOpen={sidebarOpen}>
        <CloseButton onClick={toggleSidebar}>
          <FaTimes size={30} />
        </CloseButton>
        <CategoryLink>{t('categories.necklaces')}</CategoryLink>
        <CategoryLink>{t('categories.rings')}</CategoryLink>
        <CategoryLink>{t('categories.bracelets')}</CategoryLink>
        <CategoryLink>{t('categories.earrings')}</CategoryLink>
        <CategoryLink>{t('categories.gemstones')}</CategoryLink>
        
        <LanguageSelectorContainer>
          <span>Select Language:</span>
          {Object.keys(languageMap).map((locale) => (
            <DropdownItem key={locale} onClick={() => handleLanguageChange(locale)}>
              {languageMap[locale]}
              {selectedLocale === locale && <CheckIcon />}
            </DropdownItem>
          ))}
        </LanguageSelectorContainer>
      </Sidebar>
    </OuterContainer>
  );
};

export default Navbar;
