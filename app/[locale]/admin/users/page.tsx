"use client";

import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string | null; // Allow null for created_at
}

const Container = styled.div`
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
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

  td {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media (max-width: 600px) {
    tr {
      display: block;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
    }

    th, td {
      display: block;
      width: 100%;
      text-align: right;
      position: relative;
    }

    th {
      text-align: left;
    }

    td:before {
      content: attr(data-label);
      position: absolute;
      left: 10px;
      width: 50%;
      padding-right: 10px;
      text-align: left;
      font-weight: bold;
    }
  }
`;

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Date not available'; // Handle null case
  const isoDateString = dateString.replace(' ', 'T'); // Convert to ISO format
  const date = new Date(isoDateString);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString(); // Handle invalid date
};

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/auth/users'); // Adjust the API endpoint
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Title>Manage Users</Title>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td data-label="ID">{user.id}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Name">{user.name}</td>
              <td data-label="Created At">{formatDate(user.created_at)}</td> {/* Format date */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageUsers;
