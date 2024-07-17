import type React from "react";
import { useState, useEffect } from "react";
import {
  generateTwoFactorAuth,
  validateTwoFactorAuth,
  me,
} from "../services/auth";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UpdateProfileModal from "../components/UpdateProfileModal";

const ProfilePage = () => {
  const token = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<undefined | string>(undefined);
  const defaultAvatar = "src/assets/default_avatar.png";
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    walletAddress: "",
    profilePicture: "",
    bio: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleUpdateProfile = (updatedUserInfo: any) => {
    setUserInfo(updatedUserInfo);
    toast.success("Profile updated successfully");
  };

  useEffect(() => {
    // Function to fetch user info
    const fetchUserInfo = async () => {
      try {
        const data = await me(token.token);
        console.log("data :>> ", data.user);

        setUserInfo(data.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [token]);

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
      if (response?.message === "2FA validated successfully") {
        setQrCodeUrl("");
        navigate("/profile");
      }
      toast.success("2FA token verified successfully");
      setError("");
    } catch (error) {
      toast.error("Failed to verify 2FA token. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="mb-4 flex items-center">
          <img
            src={userInfo.profilePicture || defaultAvatar}
            alt="Profile"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold">{userInfo.username}</h3>
            <p className="text-gray-600">{userInfo.email}</p>
          </div>
        </div>
        <p className="mb-4">
          <strong>Wallet Address:</strong> {userInfo.walletAddress}
        </p>
        <p className="mb-4">
          <strong>Bio:</strong> {userInfo.bio}
        </p>
        {qrCodeUrl ? (
          <div className="mt-6">
            <img src={qrCodeUrl} alt="QR Code" className="mb-4" />
            <p>Scan this QR code with your 2FA app:</p>
            <p className="font-mono">{secret}</p>
            <h3 className="text-lg font-semibold mt-4">Verify OTP</h3>
            <form onSubmit={verifyToken} className="mt-2">
              <input
                type="text"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Verify OTP
              </button>
            </form>
          </div>
        ) : (
          // biome-ignore lint/a11y/useButtonType: <explanation>
          <button
            onClick={generateSecret}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
          >
            Activate 2FA
          </button>
        )}
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
        >
          Update Profile
        </button>
        {message && <p>{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <UpdateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userInfo={userInfo}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default ProfilePage;
