"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Product = {
  id: number; // or string based on your schema
  name: string;
  description: string;
  price: number;
  image_url: string; // Ensure this matches your API response
};

const Home = () => {
  const t = useTranslations('HomePage');

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
      <Navbar />
      <h1>{t('title')}</h1>
      <h2>{t('shopTitle')}</h2>
      <div>
        {Array.isArray(products) && products.length > 0 ? (
          products.map(product => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>{t('price', { price: product.price })}</p>
              <img src={product.image_url} alt={product.name} />
            </div>
          ))
        ) : (
          <p>{t('noProducts')}</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
