"use client";

import React, { useEffect, useState } from 'react';

interface Product {
  id: string; // or number depending on your API
  name: string;
  category: string;
  stock: number; // adjust types according to your API response
}

const fetchProductsByCategory = async (category: string) => {
  const response = await fetch(`/api/auth/products?category=${encodeURIComponent(category)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const products = await response.json();
  return products;
};

const RingsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProductsByCategory('bracelets');
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

  return (
    <div>
      <h1>Bracelets</h1>
      {products.length === 0 ? (
        <p>No bracelets available in this category.</p>
      ) : (
        products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>Category: {product.category}</p>
            <p>Stock: {product.stock}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default RingsList;
