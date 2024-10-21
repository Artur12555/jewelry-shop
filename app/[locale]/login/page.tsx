// app/login/page.js
import Login from '../../components/Login';
import Register from '../../components/Register';

const LoginPage = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Login />
      <Register />
  </div>
);

export default LoginPage;
