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

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    category: '',
    stock: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/auth/manageproducts${filteredCategory ? `?category=${filteredCategory}` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filteredCategory]);

  const handleFilterChange = (e) => {
    setFilteredCategory(e.target.value);
  };

  const handleEditClick = (product) => {
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
        price: '',
        description: '',
        image_url: '',
        category: '',
        stock: '',
      });
    }
  };

  const handleUpdateProduct = async () => {
    const response = await fetch('/api/auth/manageproducts', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      );
      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        image_url: '',
        category: '',
        stock: '',
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
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
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
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        />
        <Button onClick={handleAddProduct}>Add Product</Button>
      </div>
    </Container>
  );
};

export default ManageProducts;
