"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  image_url1: string;
  image_url2: string;
  pricepln: string;
  priceeur: string;
  pricegbp: string;
}

const OuterContainer = styled.div`
  width: 80%;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ProductCard = styled.div`
  text-align: center;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  background-color: black;
  color: white;

  @media (max-width: 600px) {
    border-radius: 0;
    padding: 20px;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  border-radius: 15px;
  overflow: hidden;

  @media (max-width: 600px) {
    border-radius: 0;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  transition: opacity 0.3s;
  border-radius: 15px;

  @media (max-width: 600px) {
    border-radius: 0;
  }
`;

const ProductTitle = styled.h2`
  font-family: 'Lato';
  font-size: 16px;
  margin-top: 8px;
`;

const ProductPrice = styled.p`
  font-family: 'Lato';
  font-size: 14px;
  color: #a0a0a0;
  margin-top: 4px;
`;

const fetchProductsByCategory = async (category: string) => {
  const response = await fetch(`/api/auth/products?category=${encodeURIComponent(category)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const products = await response.json();
  return products;
};

const RingsList = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('PLN');

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') || 'PLN';
    setCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProductsByCategory('rings');
        setProducts(fetchedProducts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const getPrice = (product: Product) => {
    switch (currency) {
      case 'EUR':
        return `${product.priceeur} €`;
      case 'GBP':
        return `${product.pricegbp} £`;
      case 'PLN':
      default:
        return `${product.pricepln} zł`;
    }
  };

  return (
    <OuterContainer>
      {products.length === 0 ? (
        <p>No rings available in this category.</p>
      ) : (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              onClick={() => {
                const currentPath = window.location.pathname;
                router.push(`${currentPath}/${product.id}`);
              }}
            >
              <ProductImageContainer>
                <ProductImage
                  src={product.image_url1}
                  alt={product.name}
                  onMouseEnter={(e) => e.currentTarget.src = product.image_url2}
                  onMouseLeave={(e) => e.currentTarget.src = product.image_url1}
                />
              </ProductImageContainer>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductPrice>{getPrice(product)}</ProductPrice>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
    </OuterContainer>
  );
};

export default RingsList;
