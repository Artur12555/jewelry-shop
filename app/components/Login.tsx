"use client";

import { useState } from 'react';
import { signIn, SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock } from 'react-icons/fa';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';

const Container = styled.div`
  max-width: 400px;
  width: 90%;
  margin: 0 auto;
  @media (min-width: 768px) {
    width: auto;
  }
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
  box-sizing: border-box;
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

const ForgotPassword = styled.a`
  color: gray;
  float: right;
`;

const Login = () => {
  const t = useTranslations('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>(''); // Initialize as empty string
  const [message, setMessage] = useState<string>(''); // Initialize as empty string
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const res: SignInResponse | undefined = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      const locale = localStorage.getItem('locale') || 'en';
      router.push(`/${locale}/account`);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }), // Ensure to include the email
    });

    const text = await res.text();
    console.log('Response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('There was an error processing your request. Please try again.');
      return;
    }

    if (res.ok) {
      setMessage(data.message);
      setError('');
    } else {
      setError(data.message);
      setMessage('');
    }
  };

  return (
    <Container>
      <TitleContainer>
        <Title>{t('title')}</Title>
      </TitleContainer>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <FaUser style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder={t('email_placeholder')} 
            required 
          />
        </InputGroup>
        <InputGroup>
          <FaLock style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder={t('password_placeholder')} 
            required 
          />
        </InputGroup>
        <Button type="submit">{t('login_button')}</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <p>{message}</p>} {/* Display success message */}
        <ForgotPassword href="#" onClick={handleForgotPassword}>
          {t('forgot_password')}
        </ForgotPassword>
      </Form>
    </Container>
  );
};

export default Login;
