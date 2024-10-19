"use client";

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

type Product = {
  id: number; // or string based on your schema
  name: string;
  description: string;
  price: number;
  image_url: string; // Ensure this matches your API response
};

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        console.log(data); // Log the response data to check its structure
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
        <Navbar/>
      <h1>Jewelry and Gems Shop</h1>
      <div>
        {Array.isArray(products) && products.length > 0 ? (
          products.map(product => (
            <div key={product.id}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <img src={product.image_url} alt={product.name} />
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
