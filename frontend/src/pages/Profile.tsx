import type React from "react";
import { useState } from "react";
import { generateTwoFactorAuth, validateTwoFactorAuth } from "../services/auth";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const token = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<undefined | string>(undefined);

  const generateSecret = async () => {
    try {
      const response = await generateTwoFactorAuth(token);
      if (!response?.secret) {
        setError("Something went wrong");
      }
      console.log("response :>> ", response);

      setSecret(response.secret);
      setQrCodeUrl(response.qrCodeUrl);
      toast.success("2FA generated successfully");
      setError("");
    } catch (error) {
      console.error("Error generating secret:", error);
      toast.error("Failed to activate 2FA. Please try again.");
    }
  };

  const verifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("otpToken :>> ", otpToken);
      console.log("token :>> ", token);
      const response = await validateTwoFactorAuth(otpToken, token.token);
      console.log("response :>> ", response);
      if (!response?.data) {
        setError("Something went wrong");
      }
      if(response?.message === "2FA validated successfully"){
        setQrCodeUrl("");
        navigate("/profile")
      }
      toast.success("2FA token verified successfully");
      setError("");
    } catch (error) {
      toast.error("Failed to verify 2FA token. Please try again.");
    }
  };

  return (
    <div>
      <h2>Profile Page</h2>
      {qrCodeUrl ? (
        <div>
          <img src={qrCodeUrl} alt="QR Code" />
          <p>Scan this QR code with your 2FA app:</p>
          <p>Secret Key: {secret}</p>
          <h3>Verify OTP</h3>
          <input
            type="text"
            value={otpToken}
            onChange={(e) => setOtpToken(e.target.value)}
          />
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button onClick={verifyToken}>Verify OTP</button>
        </div>
      ) : (
        // biome-ignore lint/a11y/useButtonType: <explanation>
        <button onClick={generateSecret}>Activate 2FA</button>
      )}
      {message && <p>{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ProfilePage;
