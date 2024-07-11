import type React from 'react';
import { useState } from 'react';
import { login } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({email, password, otp });
      if(response){
        const token = response.data.token;
        toast.success('Login successful');
        localStorage.setItem('token', token);
        navigate('/');
      }else{
        toast.error('Login failed');
        console.error('Login failed');
      }
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="2FA OTP (if enabled)" />
      <button type="submit">Login</button>
      <button onClick={() => navigate('/signup')}>Register</button>
      <button onClick={() => navigate('/forgot-password')}>Forgot Password</button>
    </form>
  );
};

export default Login;
