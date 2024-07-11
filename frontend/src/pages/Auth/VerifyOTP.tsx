// src/pages/Auth/VerifyOtp.tsx
import type React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/Form/Input';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(await axios.post('http://localhost:3333/api/v1/auth/verify-otp', { email, otp })){
        navigate('/login');
      }else{
        console.error('OTP verification failed');
      }
    } catch (error) {
      console.error('Failed to verify OTP:', error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:3333/api/v1/auth/send-otp', { email });
      setTimer(60);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="text" name="otp" label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button type="submit">Verify OTP</button>
      <button type="button" onClick={handleResendOtp} disabled={timer > 0}>
        {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
      </button>
    </form>
  );
};

export default VerifyOtp;
