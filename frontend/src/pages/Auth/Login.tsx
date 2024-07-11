import type React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3333/api/v1/auth/login', { email, password, otp });
      if(response){
        const token = response.data.token;
        localStorage.setItem('token', token);
        navigate('/');
      }else{
        console.error('Login failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="2FA OTP (if enabled)" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
