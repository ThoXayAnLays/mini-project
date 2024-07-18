import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UpdateProfileModal from "../components/UpdateProfileModal";
import AddCollectionModal from "../components/AddCollectionModal";
import UpdateCollectionComponent from "../components/UpdateCollectionModal"; // Ensure correct import
import {
  generateTwoFactorAuth,
  validateTwoFactorAuth,
  me,
  updateProfile,
} from "../services/auth";
import {
  addCollection,
  eidtCollection,
  deleteCollection,
  getCollectionByUser
} from "../services/collection";
import { useAuth } from "../providers/AuthProvider";

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
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [collections, setCollections] = useState<any[]>([]);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUpdateCollectionModalOpen, setIsUpdateCollectionModalOpen] =
    useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [currentCollection, setCurrentCollection] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await me(token.token);
        console.log("user data:::", data.user);
        setUserInfo(data.user);
        const collectionsData = await getCollectionByUser(token.token);
        console.log("collection data:::", collectionsData.data.data.data);
        setCollections(collectionsData.data.data.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [token]);

  const generateSecret = async () => {
    try {
      const response = await generateTwoFactorAuth(token.token);
      setSecret(response.secret);
      setQrCodeUrl(response.qrCodeUrl);
      toast.success("2FA generated successfully");
      setError("");
    } catch (error) {
      toast.error("Failed to activate 2FA. Please try again.");
    }
  };

  const verifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await validateTwoFactorAuth(otpToken, token.token);
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

  const handleAddCollection = async (name: string, description: string) => {
    try {
      const newCollection = { name, description };
      const response = await addCollection(newCollection, token.token);
      setCollections([...collections, response.data]);
      toast.success("Collection added successfully");
      setIsCollectionModalOpen(false);
    } catch (error) {
      toast.error("Failed to add collection. Please try again.");
    }
  };

  const handleUpdateCollection = async (updatedCollection: { id: string; name: string; description: string }) => {
    try {
      const { id, name, description } = updatedCollection;
      const response = await eidtCollection(id, {name, description}, token.token);
      if (response.status === 'SUCCESS') {
        const updatedCollections = collections.map((collection) =>
          collection.id === updatedCollection.id ? updatedCollection : collection
        );
        setCollections(updatedCollections);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      setIsUpdateCollectionModalOpen(false);
    } catch (error) {
      toast.error("Failed to update collection. Please try again.");
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleEditCollection = (collection: any) => {
    setCurrentCollection(collection);
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await deleteCollection(id, token.token);
      setCollections(collections.filter((col) => col.id !== id));
      toast.success("Collection deleted successfully");
    } catch (error) {
      toast.error("Failed to delete collection. Please try again.");
    }
  };

  const handleViewCollection = async (id: string) => {
    navigate(`/collection/${id}`);
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleOpenUpdateModal = (collection: any) => {
    setCurrentCollection(collection);
    setIsUpdateCollectionModalOpen(true);
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleUpdateProfile = async (updatedInfo: any) => {
    try {
      const response = await updateProfile(updatedInfo, token.token);
      setUserInfo(response.data);
      toast.success("Profile updated successfully");
      setIsProfileModalOpen(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
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
        <div className="flex justify-end">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={() => setIsProfileModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        </div>
      </div>
      <h3 className="text-xl font-bold my-4">Collections</h3>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
        onClick={() => setIsCollectionModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        Add Collection
      </button>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-4">Name</th>
              <th className="text-left py-2 px-4">Description</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id}>
                <td className="py-2 px-4">{collection.name}</td>
                <td className="py-2 px-4">{collection.description}</td>
                <td className="py-2 px-4">
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                    onClick={() => handleOpenUpdateModal(collection)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                    onClick={() => handleViewCollection(collection.id)}
                    className="bg-green-500 text-white py-1 px-2 rounded ml-2"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddCollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onAdd={({ name, description }) => handleAddCollection(name, description)}
      />
      <UpdateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userInfo={userInfo}
        onUpdate={handleUpdateProfile}
      />
      <UpdateCollectionComponent
        isOpen={isUpdateCollectionModalOpen}
        onClose={() => setIsUpdateCollectionModalOpen(false)}
        collection={currentCollection}
        onUpdate={handleUpdateCollection}
      />
    </div>
  );
};

export default ProfilePage;
