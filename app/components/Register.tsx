// app/Register.jsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock } from 'react-icons/fa';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';

const Container = styled.div`
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
`;

const TitleContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  border-bottom: 2px solid gray;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 40px 10px 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: #0070f3;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const Register = () => {
  const t = useTranslations('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('password_mismatch', { defaultValue: "Passwords do not match" }));
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      const locale = localStorage.getItem('locale') || 'en';
      router.push(`/${locale}/login`);
    } else {
      setError(data.message);
    }
  };

  return (
    <Container>
      <TitleContainer>
        <Title>{t('title', { defaultValue: 'Zarejestruj się' })}</Title>
      </TitleContainer>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <FaUser style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder={t('email_placeholder', { defaultValue: 'Email' })} 
            required 
          />
        </InputGroup>
        <InputGroup>
          <FaLock style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder={t('password_placeholder', { defaultValue: 'Password' })} 
            required 
          />
        </InputGroup>
        <InputGroup>
          <FaLock style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <Input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder={t('confirm_password_placeholder', { defaultValue: 'Confirm Password' })} 
            required 
          />
        </InputGroup>
        <Button type="submit">{t('register_button', { defaultValue: 'Register' })}</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </Container>
  );
};

export default Register;
