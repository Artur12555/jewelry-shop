"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h1`
    font-size: 3rem;
    margin-bottom: 2rem;
`;

const Nav = styled.nav`
    display: flex;
    flex-direction: column;
`;

const Button = styled.a`
    display: inline-block;
    padding: 1rem 2rem;
    margin: 0.5rem 0;
    background-color: white;
    color: black;
    border: 2px solid black;
    text-align: center;
    text-decoration: none;
    font-size: 1.25rem;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
        background-color: black;
        color: white;
    }
`;

const AdminDashboard = () => {
    const { data: session, status } = useSession();
    const [locale] = useState<string>('en'); // Removed locale state as it's no longer used
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Wait for session to load

        if (!session || (session.user as { role: string }).role !== 'admin') {
            console.log('Redirecting to login'); // Log redirect action
            router.push('/login'); // Redirect to login page if not admin
        }
    }, [session, status, router]);

    if (!session || (session.user as { role: string }).role !== 'admin') {
        return null; // Optionally render a loading indicator or nothing while checking
    }

    return (
        <Container>
            <Title>Admin Dashboard</Title>
            <Nav>
                <Button as={Link} href={`/${locale}/admin/users`}>
                    Users
                </Button>
                <Button as={Link} href={`/${locale}/admin/orders`}>
                    Orders
                </Button>
                <Button as={Link} href={`/${locale}/admin/manageproducts`}>
                    Products
                </Button>
            </Nav>
        </Container>
    );
};

export default AdminDashboard;
