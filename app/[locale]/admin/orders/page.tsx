"use client";

import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Order {
  id: string;
  user_id: string;
  product_name: string;
  quantity: number;
  status: string;
}

const Container = styled.div`
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const StatusChangeContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Select = styled.select`
  margin-right: 10px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }

  td {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const ProductName = styled.td`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState<string>('Pending');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/auth/usersorders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleStatusChange = async () => {
    try {
      const response = await fetch(`/api/auth/usersorders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedOrders, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      const refreshedOrders = await fetch('/api/auth/usersorders').then(res => res.json());
      setOrders(refreshedOrders);
      setSelectedOrders([]); // Clear selected orders after update
    } catch (error) {
      setError('Failed to update order status');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Title>Manage Orders</Title>
      
      <StatusChangeContainer>
        <label htmlFor="statusSelect">Change Status: </label>
        <Select id="statusSelect" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Sent">Sent</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </Select>
        <Button onClick={handleStatusChange} disabled={selectedOrders.length === 0}>Update Status</Button>
      </StatusChangeContainer>
      
      <Table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedOrders.includes(order.id)} 
                  onChange={() => handleSelectOrder(order.id)} 
                />
              </td>
              <td>{order.id}</td>
              <td>{order.user_id}</td>
              <ProductName>{order.product_name}</ProductName>
              <td>{order.quantity}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageOrders;
