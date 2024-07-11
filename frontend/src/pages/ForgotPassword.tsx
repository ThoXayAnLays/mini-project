import React, { useState } from "react";
import * as AuthService from "../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<undefined | string>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await AuthService.forgotPassword(email);
      if(response.status !== 200){
        toast.success(response.message);
        setMessage(response.message);
        navigate("/reset-password");
      }else{
        toast.error("Something went wrong");
      }
    } catch (error) {
        toast.error("Something went wrong");
      console.log("error :>> ", error);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
