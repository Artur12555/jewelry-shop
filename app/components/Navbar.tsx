import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { FaShoppingBasket, FaSearch } from 'react-icons/fa'
import { Playfair_Display } from 'next/font/google'
import { Lato } from 'next/font/google' 

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-playfair-display',
});

const lato = Lato({
    subsets: ['latin'],
    weight: ['100', '300', '400', '700'],
    variable: '--font-lato',
});

const OuterContainer = styled.div`
  background-color: black;
  color: white;
  width: 100%;
  font-weight: 300;
`

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
  font-family: var(--font-lato), sans-serif; /* Apply Lato to NavbarContainer */
`

const Logo = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  text-align: left;
`

const ContactInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: var(--font-lato), sans-serif; /* Use Lato for contact info */
`

const Separator = styled.span`
  margin: 0 10px;
  border-left: 1px solid white; /* Vertical line */
  height: 20px; /* Adjust height as needed */
`

const IconsContainer = styled.div`
  flex: 1;
  text-align: right;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
`

const IconWrapper = styled.div`
  align-items: center;
  font-family: var(--font-lato), sans-serif; /* Ensure icons use Lato */
`

const Navbar = () => {
  return (
    <OuterContainer>
      <NavbarContainer className={`${playfairDisplay.variable} ${lato.variable}`}>
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
            <FaSearch size={30} />
            <span>Search</span>
          </IconWrapper>
          <IconWrapper>
            <FaShoppingBasket size={30} />
            <span>Cart</span>
          </IconWrapper>
        </IconsContainer>
      </NavbarContainer>
    </OuterContainer>
  )
}

export default Navbar
