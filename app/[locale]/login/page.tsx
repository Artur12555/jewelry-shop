// app/login/page.js
"use client";

import styled from 'styled-components';
import Login from '../../components/Login';
import Register from '../../components/Register';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 140px;
  padding-bottom: 100px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    width: 30%;
    min-width: 800px;
    margin-bottom: 100px;

    margin: 0 auto;
  }
`;

const LoginStyled = styled(Login)`

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px; // Space between Login and Register on mobile
  }
`;

const LoginPage = () => (
  <Container>
    <LoginStyled />
    <Register />
  </Container>
);

export default LoginPage;
