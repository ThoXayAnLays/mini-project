import type React from 'react';
import { useState, useEffect } from 'react';

const VerifyOtpForm: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleResendOtp = async () => {
    if (canResend) {
      setCountdown(60);
      setCanResend(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="otp">Enter OTP:</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <button type="submit">Verify OTP</button>
      <div>
        {canResend ? (
          <button type="button" onClick={handleResendOtp}>
            Resend OTP
          </button>
        ) : (
          <p>Resend OTP in {countdown} seconds</p>
        )}
      </div>
    </form>
  );
};

export default VerifyOtpForm;
