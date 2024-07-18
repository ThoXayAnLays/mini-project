import type React from "react";
import { useState } from "react";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  userInfo: {
    username: string;
    email: string;
    walletAddress: string;
    bio: string;
    profilePicture: string;
  };
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onUpdate: (updatedUserInfo: any) => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  isOpen,
  onClose,
  userInfo,
  onUpdate,
}) => {
  const [updatedUserInfo, setUpdatedUserInfo] = useState(userInfo);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserInfo({ ...updatedUserInfo, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Handle profile update logic here
    onUpdate(updatedUserInfo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Update Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={updatedUserInfo.username}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={updatedUserInfo.email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Wallet Address</label>
          <input
            type="text"
            name="walletAddress"
            value={updatedUserInfo.walletAddress}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bio</label>
          <input
            type="text"
            name="bio"
            value={updatedUserInfo.bio}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Profile Picture</label>
          <input type="file" onChange={handleFileChange} className="w-full" />
        </div>
        <div className="flex justify-end">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
