import type React from "react";
import { useState } from "react";
import { login, sendOtp } from "../../services/auth";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../providers/AuthProvider";

const Login: React.FC = () => {
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<undefined | string>(undefined);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password, token: otp});

      const resCode = data?.error?.message;
      console.log("resCode :>> ", resCode);
      
      if (resCode === 'Request failed with status code 400') {
        setError("Wrong username or password");
        return;
      }
      if (resCode === 'Request failed with status code 401') {
        setError("Invalid 2FA token");
        return;
      }
      if (resCode === 'Request failed with status code 502') {

        await sendOtp(email);
        navigate("/verify-otp", { state: { email } });
        return;
      }

      if (!data?.token.token) {
        return setError("Something went wrong!");
      }

      if(data.token.token){
        setToken(data.token.token);
        navigate("/profile");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.log("error :>> ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="2FA OTP (if enabled)"
      />
      <button type="submit">Login</button>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={() => navigate("/signup")}>Register</button>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={() => navigate("/forgot-password")}>
        Forgot Password
      </button>
      <p className="text-red-500 text-sm">{error}</p>
    </form>
  );
};

export default Login;
