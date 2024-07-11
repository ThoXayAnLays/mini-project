import React, { useState } from "react";
import { generateTwoFactorAuth, validateTwoFactorAuth } from "../services/auth";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const token = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [message, setMessage] = useState("");

  const generateSecret = async () => {
    try {
      const response = await generateTwoFactorAuth(token); // Replace with actual API endpoint
      setSecret(response.data.secret);
      setQrCodeUrl(response.data.qrCodeUrl);
      toast.success("2FA activated successfully");
    } catch (error) {
      console.error("Error generating secret:", error);
      toast.error("Failed to activate 2FA. Please try again.");
    }
  };

  const verifyToken = async () => {
    try {
      const response = await validateTwoFactorAuth(otpToken, token); // Replace with actual API endpoint
      toast.success("2FA token verified successfully", response.data.message);
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
        </div>
      ) : (
        <button onClick={generateSecret}>Activate 2FA</button>
      )}

      <h3>Verify OTP</h3>
      <input
        type="text"
        value={otpToken}
        onChange={(e) => setOtpToken(e.target.value)}
      />
      <button onClick={verifyToken}>Verify OTP</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfilePage;
