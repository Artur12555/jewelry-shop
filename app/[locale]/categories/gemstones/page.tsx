"use client";

import React, { useEffect, useState } from 'react';

const fetchProductsByCategory = async (category) => {
  const response = await fetch(`/api/auth/products?category=${encodeURIComponent(category)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const products = await response.json();
  return products;
};

const RingsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProductsByCategory('gemstones');
        setProducts(fetchedProducts);
      } catch (error) {
        setError(error.message);
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
      <h1>Gemstones</h1>
      {products.length === 0 ? (
        <p>No gemstones available in this category.</p>
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
