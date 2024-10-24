"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
`;

const Filter = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }
`;

const Button = styled.button`
  margin: 5px;
`;

const categories = ['necklaces', 'rings', 'bracelets', 'earrings', 'gemstones'];

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  stock: number;
};

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    description: '',
    image_url: '',
    category: '',
    stock: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/auth/manageproducts${filteredCategory ? `?category=${filteredCategory}` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
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

    fetchProducts();
  }, [filteredCategory]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilteredCategory(e.target.value);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
  };

  const handleAddProduct = async () => {
    const response = await fetch('/api/auth/manageproducts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      const addedProduct = await response.json();
      setProducts((prev) => [...prev, addedProduct]);
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        image_url: '',
        category: '',
        stock: 0,
      });
    }
  };

  const handleUpdateProduct = async () => {
    const response = await fetch('/api/auth/manageproducts', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newProduct, id: editingProduct?.id }), // Ensure the ID is included
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      );
      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        image_url: '',
        category: '',
        stock: 0,
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Title>Manage Products</Title>
      <Filter>
        <select onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </Filter>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Image URL</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  />
                ) : (
                  product.price
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                ) : (
                  product.description
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  />
                ) : (
                  product.image_url
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                ) : (
                  product.category
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td>
                {editingProduct?.id === product.id ? (
                  <>
                    <Button onClick={handleUpdateProduct}>Save</Button>
                    <Button onClick={() => setEditingProduct(null)}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={() => handleEditClick(product)}>Edit</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Add New Product</h2>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image_url}
          onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
        />
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
        />
        <Button onClick={handleAddProduct}>Add Product</Button>
      </div>
    </Container>
  );
};

export default ManageProducts;
